from flask import render_template, request, redirect, url_for
from . import bp
from ..models import db, Serrc

@bp.route('/serrcs')
def serrcs_list():
    serrcs = Serrc.query.all()
    return render_template('serrcs.html', serrcs=serrcs)

@bp.route('/serrcs/add', methods=['POST'])
def add_serrc():
    serrc_no = request.form.get('serrc_no')
    program_name = request.form.get('program_name')
    cause = request.form.get('cause')
    action = request.form.get('action')
    
    if serrc_no and program_name:
        new_serrc = Serrc(serrc_no=serrc_no, program_name=program_name, cause=cause, action=action)
        db.session.add(new_serrc)
        db.session.commit()
        
    return redirect(url_for('main.serrcs_list'))

@bp.route('/serrcs/delete/<int:id>', methods=['POST'])
def delete_serrc(id):
    serrc = Serrc.query.get_or_404(id)
    db.session.delete(serrc)
    db.session.commit()
    return redirect(url_for('main.serrcs_list'))
