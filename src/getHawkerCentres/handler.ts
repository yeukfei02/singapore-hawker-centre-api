import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import dynamoose from "dynamoose";
dynamoose.aws.sdk.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1",
});

import SingaporeHawkerCentre from "../../model/HawkerCentre";

export const getHawkerCentres: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  let response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "getHawkerCentres",
      hawkerCentres: [],
      count: 0,
    }),
  };

  let singaporeHawkerCentreList: unknown[] = [];

  if (event.queryStringParameters) {
    const search = event.queryStringParameters.search
      ? event.queryStringParameters.search
      : "";

    const condition = new dynamoose.Condition()
      .where("name_of_centre")
      .contains(search)
      .or()
      .where("location_of_centre")
      .contains(search);

    const singaporeHawkerCentre = await SingaporeHawkerCentre.scan(condition)
      .all()
      .exec();
    singaporeHawkerCentreList = singaporeHawkerCentre.toJSON();
  } else {
    const singaporeHawkerCentre = await SingaporeHawkerCentre.scan()
      .all()
      .exec();
    singaporeHawkerCentreList = singaporeHawkerCentre.toJSON();
  }

  response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "getHawkerCentres",
      hawkerCentres: singaporeHawkerCentreList,
      count: singaporeHawkerCentreList ? singaporeHawkerCentreList.length : 0,
    }),
  };

  return response;
};
