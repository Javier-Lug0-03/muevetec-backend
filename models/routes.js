const mongoose = require('mongoose')

const StopSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: {
      type: {
        type: String, 
        enum: ["Point"], 
        required: true,
      },
      coordinates: {
        type: [Number], 
        required: true,
      },
    },
    minutes: {
      type:String, 
      required: true},
    minutes2: {
      type:String,
      required: false
    },
    minutes3: {
      type:String,
      required: false
    },
    minutes4: {
      type:String,
      required: false
    }
    
});

const routeSchema = new mongoose.Schema({
    name: {type: String, required: true,},
    stops: {type: [StopSchema], required:true},
    interestedCount: {type: Number, default:0}
})

routeSchema.index({"stops.location":"2dsphere"});

module.exports = mongoose.model("Ruta", routeSchema)