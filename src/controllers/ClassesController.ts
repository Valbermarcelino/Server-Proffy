import {Request, Response} from 'express'

import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem{
    week_day: number;
    from: string;
    to: string;
}

export default class ClassesController{
    async index(request: Request, response: Response){
        const filter = request.query;

        const subject = filter.subject as string;
        const week_day = filter.week_day as string;
        const time = filter.time as string;

        if(!filter.week_day || !filter.subject || !filter.time){
            return response.status(400).json({
                error: "Missing filter to search classes"
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        const classes = await db('classes')
        .whereExists(function(){
            this.select('class_schedule.*')
                .from('class_schedule')
                .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
                .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)]) //?? -> parametro
                .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
        })
        .where('classes.subject', '=', subject)
        .join('users', 'classes.user_id', '=', 'users.id')
        .select(['classes.*', 'users.*']);

        return response.json(classes);
    }

    async create (request: Request, response: Response) {
        /*const data = request.body;
    
        console.log(data);*/
    
        const{
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule
        } = request.body;
    
        const trx = await db.transaction(); //em vez de salvar com algum errado ele só salva tudo se tiver tudo certo, se não ele desfaz os outros
    
        try{
            const insertUsersIds = await /*db->trx*/ trx('users').insert({ 
                name, /*se fosse hardcode/colocar os valor na mão - name: 'Valber'*/
                avatar,
                whatsapp,
                bio,
            });
        
            const user_id = insertUsersIds[0];
        
            const insertedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });
        
            const class_id = insertedClassesIds[0];
        
            const classSchedule = schedule.map((scheduleItem: ScheduleItem/*any*/) => {
                return{
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to),
                };
            })
        
            await trx('class_schedule').insert(classSchedule);
            
            await trx.commit();
        
            return response.status(201).send();
        } catch(err){
            //console.log(err);
            await trx.rollback();
    
            return response.status(400).json({
                error: 'Unexpected error while creating new class'
            })
        }
    }
}