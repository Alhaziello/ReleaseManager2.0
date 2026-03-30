from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Serrc(db.Model):
    __tablename__ = 'serrc'
    id = db.Column(db.Integer, primary_key=True)
    serrc_no = db.Column(db.String(50), unique=True, nullable=False)
    program_name = db.Column(db.String(100), nullable=False)
    cause = db.Column(db.Text)
    action = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'serrcNo': self.serrc_no,
            'programName': self.program_name,
            'cause': self.cause,
            'action': self.action
        }

class Promote(db.Model):
    __tablename__ = 'promote'
    id = db.Column(db.Integer, primary_key=True)
    ticket_no = db.Column(db.String(50))
    programmer = db.Column(db.String(100))
    project = db.Column(db.String(100))
    description = db.Column(db.Text)
    jenkins_job_id = db.Column(db.Integer)
    git_sha = db.Column(db.String(40))
    tester_name_1 = db.Column(db.String(100))
    tester_name_2 = db.Column(db.String(100))
    special_requirement = db.Column(db.Text)
    fallback_option = db.Column(db.String(100))
    load_module = db.Column(db.String(100))
    colsol_mod = db.Column(db.String(100))
    promote_date = db.Column(db.String(50))
    load_date = db.Column(db.String(50))
    change_number = db.Column(db.String(50))
    colsol_date = db.Column(db.String(50))
    note = db.Column(db.Text)
    job_status = db.Column(db.String(50))
    fallback_date = db.Column(db.String(50))
    fbk_git_sha = db.Column(db.String(40))
    fbk_job_id = db.Column(db.Integer)
    fbk_note = db.Column(db.Text)
    
    macros = db.relationship('PromoteMacro', backref='promote', lazy=True, cascade="all, delete-orphan")
    programs = db.relationship('PromoteProgram', backref='promote', lazy=True, cascade="all, delete-orphan")

    def to_dict(self):
        return {
            'id': self.id,
            'ticketNo': self.ticket_no,
            'programmer': self.programmer,
            'project': self.project,
            'description': self.description,
            'jenkinsJobId': self.jenkins_job_id,
            'gitSha': self.git_sha,
            'jobStatus': self.job_status,
            'promoteDate': self.promote_date,
            'macros': [m.to_dict() for m in self.macros],
            'programs': [p.to_dict() for p in self.programs]
        }

class PromoteMacro(db.Model):
    __tablename__ = 'promote_macro'
    id = db.Column(db.Integer, primary_key=True)
    promote_id = db.Column(db.Integer, db.ForeignKey('promote.id'), nullable=False)
    macro_name = db.Column(db.String(100))
    promote_response = db.Column(db.Text)
    promote_time = db.Column(db.String(50))

    def to_dict(self):
        return {
            'id': self.id,
            'macroName': self.macro_name,
            'promoteResponse': self.promote_response,
            'promoteTime': self.promote_time
        }

class PromoteProgram(db.Model):
    __tablename__ = 'promote_program'
    id = db.Column(db.Integer, primary_key=True)
    promote_id = db.Column(db.Integer, db.ForeignKey('promote.id'), nullable=False)
    program = db.Column(db.String(100))
    old_version = db.Column(db.Integer)
    new_version = db.Column(db.Integer)
    promote_response = db.Column(db.Text)
    assembly_cc = db.Column(db.String(100))
    promote_time = db.Column(db.String(50))
    program_listing = db.Column(db.Text)

    def to_dict(self):
        return {
            'id': self.id,
            'program': self.program,
            'oldVersion': self.old_version,
            'newVersion': self.new_version,
            'promoteResponse': self.promote_response,
            'assemblyCc': self.assembly_cc,
            'promoteTime': self.promote_time,
            'programListing': self.program_listing
        }
