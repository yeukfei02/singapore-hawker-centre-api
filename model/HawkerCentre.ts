import dynamoose from "dynamoose";
dynamoose.aws.sdk.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1",
});

const singaporeHawkerCentreSchema = new dynamoose.Schema(
  {
    id: String,
    owner: String,
    type_of_centre: String,
    name_of_centre: String,
    no_of_stalls: Number,
    no_of_mkt_produce_stalls: Number,
    no_of_cooked_food_stalls: Number,
    location_of_centre: String,
  },
  {
    saveUnknown: true,
    timestamps: true,
  }
);

const singaporeHawkerCentreModel = dynamoose.model(
  "prod-singapore-hawker-centre-api-SingaporeHawkerCentre",
  singaporeHawkerCentreSchema,
  {
    create: false,
    waitForActive: {
      enabled: false,
    },
  }
);

export default singaporeHawkerCentreModel;
