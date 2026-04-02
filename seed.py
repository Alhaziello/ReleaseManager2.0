import random
from datetime import datetime, timedelta
from app import create_app
from app.models import db, Promote, PromoteProgram, User, SystemConfig

app = create_app()

def seed_database():
    with app.app_context():
        # Reset the entire database schema to reflect new columns
        print("Resetting database schema...")
        db.drop_all()
        db.create_all()
        
        print("Seeding System Config...")
        cycle = SystemConfig(key='release_cycle', value='Weekly', description='System Release Frequency (Weekly or Daily)')
        db.session.add(cycle)
        
        print("Seeding Initial Mock SSO Users...")
        admin = User(worker_id="AIRNZ-NZ\\ADMIN1", role="ADMIN")
        qa = User(worker_id="AIRNZ-NZ\\QA1", role="QA")
        dev = User(worker_id="AIRNZ-NZ\\DEV1", role="DEV")
        db.session.add_all([admin, qa, dev])
        
        programmers = ["Alice", "Bob", "Charlie", "David", "Eve"]
        descriptions = [
            "Bugfix for login module",
            "Refactoring the checkout pipeline",
            "Upgrading legacy SQL queries",
            "UI enhancements for accessibility",
            "Adding new API endpoints for mobile",
            "Hotfix: security vulnerability"
        ]
        
        today = datetime.now()
        
        # Calculate exactly when "Last Wednesday" was
        days_since_wednesday = (today.weekday() - 2) % 7
        if days_since_wednesday == 0:
            days_since_wednesday = 7
        last_wednesday = today - timedelta(days=days_since_wednesday)
        last_wednesday = last_wednesday.replace(hour=13, minute=0, second=0, microsecond=0)
        
        print(f"Seeding exactly 100 Load Modules around Last Wednesday ({last_wednesday.strftime('%Y-%m-%d')})...")
        
        for i in range(1, 101):
            # Generate a random date between 1 and 40 days ago
            days_ago = random.randint(1, 40)
            mock_date = today - timedelta(days=days_ago)
            # Add a bit of random hour/minute jitter
            mock_date = mock_date.replace(hour=random.randint(8,17), minute=random.randint(0,59))
            promote_date_str = mock_date.strftime("%Y-%m-%d %H:%M:%S")
            
            # Scenario Logic: All loads BEFORE last wednesday are LOADED
            if mock_date < last_wednesday:
                status = "Loaded To Production (A0)"
                # 30% chance it's fully archived
                if random.random() < 0.3:
                    status = "Consolidated To A2ZDAT"
            else:
                # Scenario Logic: Modules from last wednesday to NOW are actively traversing the pipeline.
                # We heavily weight against "TBC" and "Consolidated" to create actionable QA/ADMIN targets.
                status = random.choices([
                    "Success", "Ready for Qual",
                    "UAT in Progress", "UAT Failed", "Awaiting Approval (PROD)", 
                    "Ready for Production", "TBC"
                ], weights=[
                    15, 25, 
                    25, 10, 15, 
                    5, 5
                ])[0]
                
            # Create Promote
            ticket = f"PRJ-{1000 + i}"
            p = Promote(
                ticket_no=ticket,
                programmer=random.choice(programmers),
                description=random.choice(descriptions),
                jenkins_job_id=random.randint(5000, 9999),
                job_status=status,
                promote_date=promote_date_str,
                load_module=f"{ticket}_module"
            )
            
            db.session.add(p)
            db.session.flush() # To get p.id for programs
            
            # Add 1 to 3 mock programs
            for j in range(random.randint(1, 3)):
                prog = PromoteProgram(
                    promote_id=p.id,
                    program=f"PGM{random.randint(100, 999)}",
                    old_version=1,
                    new_version=2
                )
                db.session.add(prog)
                
        db.session.commit()
        print("Database successfully seeded with 100 mock modules!")

if __name__ == "__main__":
    seed_database()
