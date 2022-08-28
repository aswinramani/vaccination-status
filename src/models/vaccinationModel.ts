import * as mongoose from "mongoose";

let Schema = mongoose.Schema;

const VaccinationSchema: mongoose.Schema = new Schema({
    YearWeekISO:  String,
    FirstDose: Number,
    FirstDoseRefused: Object,
    SecondDose: Number,
    DoseAdditional1: Number,
    DoseAdditional2: Number,
    UnknownDose: Number,
    NumberDosesReceived: Number,
    NumberDosesExported: Number,
    Region: String,
    Population: Number,
    ReportingCountry: String,
    TargetGroup: String,
    Vaccine: String,
    Denominator: Number
});

export const VaccinationModel = mongoose.model('vaccinations', VaccinationSchema);
