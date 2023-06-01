import * as raspberryService from "./raspberry.service.js";

const raspberryController = express.Router();

raspberryController.get("/", raspberryService.getRas);

export default raspberryController;
