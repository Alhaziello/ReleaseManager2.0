import os
import shutil
import threading
import time
import requests
from flask import current_app

class JenkinsService:
    @staticmethod
    def trigger_production_deploy(promote_id, load_module, api_port):
        """
        Simulates a Jenkins build server receiving a deployment trigger.
        Physically moves the binary XML file from UAT -> PROD_LOAD.
        Uses a background thread to simulate the build time, then calls the
        CARINA API Webhook to report success.
        """
        # We need to run the background task independently of the request context
        # So we pass the necessary config values into the thread function
        base_path = current_app.config['JENKINS_BASE_PATH']
        
        def run_mock_deployment(p_id, module_name, base_dir, port):
            # 1. Simulate Deployment Time (e.g., 5 seconds build)
            time.sleep(5)
            
            # 2. Physically move the mock binary file
            src = os.path.join(base_dir, 'UAT', f"{module_name}.xml")
            dst = os.path.join(base_dir, 'PROD_LOAD', f"{module_name}.xml")
            
            # Create directories if they don't exist in our mock environment
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            
            # If the source file exists (it should, after UAT authorization), move it
            # If not, we create a dummy file just to simulate the move logic
            if os.path.exists(src):
                shutil.move(src, dst)
            else:
                with open(dst, 'w') as f:
                    f.write('<dummy_production_binary/>')
            
            # 3. Call the CARINA Webhook API to report "Landed" status
            webhook_url = f"http://127.0.0.1:{port}/api/promote/{p_id}/updjobstatus"
            payload = {
                "jobStatus": "Loaded To Production (A0)"
            }
            try:
                # We use a POST/PUT to the webhook. The existing API is PUT.
                requests.put(webhook_url, json=payload)
            except Exception as e:
                # In a background thread without a context, we can print to the terminal
                print(f"[JENKINS SERVICE ERROR] Webhook failed: {str(e)}")

        # Start the simulated Jenkins job in the background
        current_app.logger.info(f"[JENKINS TRIGGERED] Starting deployment for module: {load_module}")
        thread = threading.Thread(
            target=run_mock_deployment, 
            args=(promote_id, load_module, base_path, api_port)
        )
        thread.daemon = True
        thread.start()
        return True
