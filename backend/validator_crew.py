from crewai import Agent, Task, Crew, Process, LLM
import os

# Default: local Ollama (qwen3.5). Set USE_GEMINI=true in .env to switch to Gemini.
_gemini_key = os.getenv("GEMINI_API_KEY", "")
_use_gemini = os.getenv("USE_GEMINI", "false").lower() == "true"

if _use_gemini and _gemini_key and _gemini_key != "your_gemini_api_key":
    llm = LLM(
        model="gemini/gemini-1.5-flash",
        api_key=_gemini_key
    )
else:
    llm = LLM(
        model=f"ollama/{os.getenv('OLLAMA_MODEL', 'qwen3.5')}",
        base_url=os.getenv("OLLAMA_BASE_URL", "http://host.docker.internal:11434")
    )

def run_validation_crew(idea: str, target_customer: str) -> str:
    # --- AGENTS ---
    market_analyst = Agent(
        role='Market Analyst',
        goal='Analyze the market landscape for a given startup idea and target customer.',
        backstory='Expert in market sizing, trends, and identifying TAM/SAM/SOM.',
        verbose=True,
        llm=llm
    )

    competitor_scouter = Agent(
        role='Competitor Scouter',
        goal='Identify direct and indirect competitors and highlight their weaknesses.',
        backstory='Ruthless business strategist who knows how to find gaps in competitors\' offerings.',
        verbose=True,
        llm=llm
    )

    pricing_strategist = Agent(
        role='Pricing Strategist',
        goal='Develop a viable pricing model for the product.',
        backstory='Economics expert specializing in SaaS and consumer pricing psychology.',
        verbose=True,
        llm=llm
    )

    copywriter = Agent(
        role='Direct Response Copywriter',
        goal='Draft a high-converting landing page structure (Headline, Subheadline, 3 Features, Call to Action).',
        backstory='Don Draper of the digital age. Masters in persuasive writing.',
        verbose=True,
        llm=llm
    )

    devils_advocate = Agent(
        role='Customer Objector',
        goal='Simulate 3 major objections the target customer will have, and provide rebuttals.',
        backstory='A highly skeptical potential buyer who doesn\'t want to spend money.',
        verbose=True,
        llm=llm
    )

    # --- TASKS ---
    task_market = Task(
        description=f'Analyze the market for this idea: "{idea}". Target customer: "{target_customer}". Provide a 2-paragraph summary.',
        expected_output='A 2-paragraph market analysis.',
        agent=market_analyst
    )

    task_competitors = Task(
        description=f'Identify 3 potential competitors for the idea "{idea}". List their core weakness.',
        expected_output='A bulleted list of 3 competitors and weaknesses.',
        agent=competitor_scouter
    )

    task_pricing = Task(
        description=f'Suggest 3 pricing tiers for the idea "{idea}" aimed at "{target_customer}".',
        expected_output='3 clearly defined pricing tiers with suggested dollar amounts.',
        agent=pricing_strategist
    )

    task_landing = Task(
        description=f'Draft a landing page for "{idea}". Include Headline, Subheadline, 3 bullet features, and a Call to Action button text.',
        expected_output='A structured landing page copy draft.',
        agent=copywriter
    )

    task_objections = Task(
        description=f'List 3 cynical objections the "{target_customer}" will have against "{idea}", and write a 1-sentence rebuttal for each.',
        expected_output='3 Objections with corresponding rebuttals.',
        agent=devils_advocate
    )

    # --- CREW ---
    crew = Crew(
        agents=[market_analyst, competitor_scouter, pricing_strategist, copywriter, devils_advocate],
        tasks=[task_market, task_competitors, task_pricing, task_landing, task_objections],
        process=Process.sequential,
        verbose=True
    )

    result = crew.kickoff()
    return result