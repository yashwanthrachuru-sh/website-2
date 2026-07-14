import asyncio
import websockets
import json

async def capture_logs():
    ws_url = "ws://127.0.0.1:9222/devtools/page/CA1AA8739C7A1320155914DE1274B72C"
    print(f"Connecting to CDP at {ws_url}...")
    
    logs = []
    
    async with websockets.connect(ws_url) as ws:
        # Enable Log and Runtime
        await ws.send(json.dumps({"id": 1, "method": "Log.enable"}))
        await ws.send(json.dumps({"id": 2, "method": "Runtime.enable"}))
        # Enable Page to reload
        await ws.send(json.dumps({"id": 3, "method": "Page.enable"}))
        
        async def listen():
            try:
                async for message in ws:
                    data = json.loads(message)
                    method = data.get("method")
                    if method == "Log.entryAdded":
                        entry = data.get("params", {}).get("entry", {})
                        logs.append({
                            "source": "Log",
                            "level": entry.get("level"),
                            "text": entry.get("text"),
                            "url": entry.get("url"),
                            "lineNumber": entry.get("lineNumber")
                        })
                    elif method == "Runtime.consoleAPICalled":
                        params = data.get("params", {})
                        args = params.get("args", [])
                        text = " ".join([arg.get("value", str(arg)) if isinstance(arg, dict) else str(arg) for arg in args])
                        logs.append({
                            "source": "Console",
                            "level": params.get("type"),
                            "text": text
                        })
                    elif method == "Runtime.exceptionThrown":
                        details = data.get("params", {}).get("exceptionDetails", {})
                        exception = details.get("exception", {})
                        logs.append({
                            "source": "Exception",
                            "level": "error",
                            "text": details.get("text") + ": " + exception.get("description", "")
                        })
            except asyncio.CancelledError:
                pass

        # Start listening task
        listener_task = asyncio.create_task(listen())
        
        print("Reloading page...")
        await ws.send(json.dumps({"id": 4, "method": "Page.reload", "params": {"ignoreCache": True}}))
        
        # Wait 6 seconds for loading and errors to settle
        await asyncio.sleep(6)
        
        # Cancel listener
        listener_task.cancel()
        
        print("\n--- Captured Console Logs & Errors ---")
        errors_count = 0
        for log in logs:
            level_str = log["level"].upper()
            if log["level"] in ["error", "exception"]:
                errors_count += 1
                print(f"🔴 [{log['source']}] [{level_str}]: {log['text']}")
            elif log["level"] == "warning":
                print(f"🟡 [{log['source']}] [{level_str}]: {log['text']}")
            else:
                print(f"⚪ [{log['source']}] [{level_str}]: {log['text']}")
                
        print(f"\nTotal Errors: {errors_count}")

asyncio.run(capture_logs())
