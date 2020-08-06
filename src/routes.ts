import express from 'express';
import ClassesController from './controllers/ClassesController';
import ConnectionsController from './controllers/ConnectionsController';

const routes = express.Router();
const classesControllers = new ClassesController();
const connectionsController = new ConnectionsController();

routes.get('/classes', classesControllers.index);
routes.post('/classes', classesControllers.create);

routes.get('/connections', connectionsController.index);
routes.post('/connections', connectionsController.create);

export default routes;



/*  {
	 "name": "Valber",
	 "avatar": 
	 "https://instagram.fubt1-1.fna.fbcdn.net/v/t51.2885-19/s150x150/75280196_747899542397651_4926991176923348992_n.jpg?_nc_ht=instagram.fubt1-1.fna.fbcdn.net&_nc_ohc=7bg9zZgnyLIAX_sKPjP&oh=527cef73e9fcf8b5516e481ce0db3947&oe=5F56BB7A",
	 "whatsapp": "12981357533",
	 "bio": "skatista engenheiro",
	 "subject": "marcenaria do skate",
	 "cost": 100,
	 "schedule":[
		 {"week_day": 1, "from":"8:00", "to": "12:00"},
		 {"week_day": 3, "from":"10:00", "to": "10:00"},
		 {"week_day": 4, "from":"8:00", "to": "12:00"}
	 ]
 } */