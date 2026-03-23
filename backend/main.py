from fastapi import FastAPI, BackgroundTasks
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import os
import asyncio
from validator_crew import run_validation_crew
from telegram import Update
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes

app = FastAPI()

# Allow web UI to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ValidationRequest(BaseModel):
    idea: str
    target_customer: str

# --- FASTAPI ENDPOINTS ---
@app.post("/api/validate")
async def validate_idea(req: ValidationRequest):
    # In a production app, you'd run this in a background task and return a job ID.
    # For MVP, we will block and wait for the crew to finish.
    try:
        result = run_validation_crew(idea=req.idea, target_customer=req.target_customer)
        # Note: CrewAI returns an object, we cast it to string
        return {"status": "success", "report": str(result)}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# --- TELEGRAM BOT LOGIC ---
telegram_app = None

async def start_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello! Send me an idea and target customer in this format:\n\nIdea: [Your Idea]\nCustomer: [Target Customer]")

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    if "Idea:" in text and "Customer:" in text:
        await update.message.reply_text("Agents are analyzing your idea. This will take a minute or two...")
        
        # Parse the message
        lines = text.split('\n')
        idea = lines[0].replace("Idea:", "").strip()
        customer = lines[1].replace("Customer:", "").strip()
        
        # Run CrewAI (running in a separate thread so it doesn't block Telegram polling)
        loop = asyncio.get_event_loop()
        result = await loop.run_in_executor(None, run_validation_crew, idea, customer)
        
        # Telegram has a 4096 char limit, might need to chunk in a real scenario
        await update.message.reply_text(f"📊 *Validation Report:*\n\n{result}", parse_mode='Markdown')
    else:
        await update.message.reply_text("Please use the format:\nIdea: ...\nCustomer: ...")

# --- LIFECYCLE MANAGEMENT ---
@app.on_event("startup")
async def startup_event():
    global telegram_app
    token = os.getenv("TELEGRAM_BOT_TOKEN")
    if token:
        telegram_app = Application.builder().token(token).build()
        telegram_app.add_handler(CommandHandler("start", start_command))
        telegram_app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
        
        await telegram_app.initialize()
        await telegram_app.start()
        await telegram_app.updater.start_polling()
        print("Telegram bot started.")

@app.on_event("shutdown")
async def shutdown_event():
    if telegram_app:
        await telegram_app.updater.stop()
        await telegram_app.stop()
        await telegram_app.shutdown()