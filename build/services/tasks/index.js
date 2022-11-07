import { Router } from "express";
import moment from "moment";
import TaskModel from "./task.js";
const taskRoute = Router();
taskRoute.get("/", async (req, res, next) => {
    try {
        let tasks = await TaskModel.find({ checked: false }).sort({ order: 1 });
        let count = tasks.length;
        let today = moment(new Date().toISOString()).format("DD/MM");
        let tomorrow = moment(new Date().toISOString()).add(1, "day").format("DD/MM");
        let dates = new Set();
        let byDate = {};
        tasks.forEach(t => {
            if (moment(t.due).isBefore(moment(new Date()), "day")) {
                dates.add("expired");
                byDate.expired = [];
            }
            else if (moment(t.due).format("DD/MM") == tomorrow) {
                dates.add("tomorrow");
                byDate.tomorrow = [];
            }
            else if (moment(t.due).format("DD/MM") == today) {
                dates.add("today");
                byDate.today = [];
            }
            else if (t.due) {
                dates.add(moment(t.due).format("DD/MM"));
                byDate[moment(t.due).format("DD/MM")] = [];
            }
            else {
                dates.add("no_date");
                byDate.no_date = [];
            }
        });
        tasks.forEach(task => {
            let date = moment(task.due).format("DD/MM");
            if (moment(task.due).isBefore(moment(new Date()), "day")) {
                byDate?.expired?.push({ ...task.toObject(), due: task.due });
            }
            else if (date == today) {
                byDate?.today?.push({ ...task.toObject(), due: task.due });
            }
            else if (date == tomorrow) {
                byDate.tomorrow.push({ ...task.toObject(), due: task.due });
            }
            else if (date !== "Invalid date") {
                byDate[date]?.push({ ...task.toObject(), due: task.due });
            }
            else {
                byDate["no_date"]?.push({ ...task.toObject(), due: "" });
            }
        });
        const sortedByDate = {
            expired: byDate.expired,
            today: byDate.today,
            tomorrow: byDate.tomorrow,
            ...Object.fromEntries(Object.entries(byDate).sort(([a,], [b,]) => {
                if (a !== "expired" && a !== "today" && a !== "tomorrow" && a !== "no_date" && b !== "expired" && b !== "today" && b !== "tomorrow" && b !== "no_date") {
                    return new Date(a).getTime() - new Date(b).getTime();
                }
                else
                    return 0;
            })),
            no_date: byDate.no_date,
        };
        res.send({ byDate: sortedByDate, count });
    }
    catch (error) {
        next(error);
    }
});
taskRoute.post("/", async (req, res, next) => {
    try {
        console.log(req.body);
        let newTask = new TaskModel(req.body);
        await newTask.save();
        let allTasks = await TaskModel.find();
        res.send(allTasks);
    }
    catch (error) {
        next(error);
    }
});
taskRoute.put("/:id", async (req, res, next) => {
    try {
        await TaskModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        let tasks = await TaskModel.find();
        res.send(tasks);
    }
    catch (error) {
        next(error);
    }
});
export default taskRoute;
