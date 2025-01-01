const bcrypt = require("bcrypt");
const UserModel = require("../models/UserModel");
require("../utils/connectDB");

async function UpdateModelUtil(model) {
    const allTheElements = await model.find();
    console.log(allTheElements);
    for (let i = 0; i < allTheElements.length; i++) {
        let entity = allTheElements[i];
        entity.password = await bcrypt.hash(entity.password, 10);
        await entity.save();
    }
}

UpdateModelUtil(UserModel)
    .then(() => console.log("Task Completed."))
    .catch(console.log)