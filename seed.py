import random
from datetime import datetime, timedelta
from app import create_app
from app.models import db, Promote, PromoteProgram

app = create_app()

def seed_database():
    with app.app_context():
        # Clear existing for a fresh start or add to it? Let's clear Promotes for a perfectly clean slate
        PromoteProgram.query.delete()
        Promote.query.delete()
        
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
        
        print("Seeding exactly 30 Promote modules...")
        
        for i in range(1, 31):
            # Generate a random date between today and 60 days ago
            days_ago = random.randint(1, 60)
            mock_date = today - timedelta(days=days_ago)
            
            # Formulate the string date
            promote_date_str = mock_date.strftime("%Y-%m-%d %H:%M:%S")
            
            # Determine status based on age
            if days_ago <= 14:
                # Up to 2 weeks ago -> UAT in Progress
                status = "UAT in Progress"
            else:
                # Older than 2 weeks -> Consolidated or Ready for Prod
                status = random.choice(["Consolidated To A2ZDAT", "Ready for Production"])
                
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
        print("Database successfully seeded with 30 mock modules!")

if __name__ == "__main__":
    seed_database()
