import * as sst from "@serverless-stack/resources";

export default class MyStack extends sst.Stack {
  constructor(scope: sst.App, id: string, props?: sst.StackProps) {
    super(scope, id, props);

    // Create the table
    const table = new sst.Table(this, "SingaporeHawkerCentre", {
      fields: {
        id: sst.TableFieldType.STRING,
        owner: sst.TableFieldType.STRING,
        type_of_centre: sst.TableFieldType.STRING,
        name_of_centre: sst.TableFieldType.STRING,
        no_of_stalls: sst.TableFieldType.NUMBER,
        no_of_mkt_produce_stalls: sst.TableFieldType.NUMBER,
        no_of_cooked_food_stalls: sst.TableFieldType.NUMBER,
        location_of_centre: sst.TableFieldType.STRING,
      },
      primaryIndex: { partitionKey: "id" },
    });

    // Create a HTTP API
    const api = new sst.Api(this, "Api", {
      routes: {
        "GET /": "src/main/handler.getMain",
        "GET /hawker-centres": "src/getHawkerCentres/handler.getHawkerCentres",
        "GET /hawker-centres/{id}":
          "src/getHawkerCentreById/handler.getHawkerCentreById",
      },
      cors: true,
    });

    // Allow the API to access the table
    api.attachPermissions([table]);

    // Create Cron Job
    new sst.Cron(this, "Cron", {
      schedule: "rate(1 day)",
      job: "cron/handler.main",
    });

    // Show the endpoint in the output
    this.addOutputs({
      ApiEndpoint: api.url,
    });
  }
}
