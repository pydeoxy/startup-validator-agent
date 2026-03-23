import subprocess
import webbrowser
import time
import sys

def main():
    print("🚀 Starting Startup Idea Validator Agent...")
    
    # 1. Start Docker Compose in detached mode
    try:
        print("📦 Building and starting Docker containers...")
        subprocess.run(["docker-compose", "up", "-d", "--build"], check=True)
    except subprocess.CalledProcessError:
        print("❌ Failed to start Docker Compose. Ensure Docker is running.")
        sys.exit(1)

    print("⏳ Waiting for services to initialize (10 seconds)...")
    time.sleep(10)

    # 2. Open the Web UI automatically
    web_url = "http://localhost:8080"
    print(f"🌐 Opening Web UI at {web_url}")
    webbrowser.open(web_url)
    
    print("\n✅ System is fully operational!")
    print("🤖 Your Telegram bot is running in the background.")
    print("🔄 To view logs: 'docker-compose logs -f'")
    print("🛑 To stop: 'docker-compose down'")

if __name__ == "__main__":
    main()