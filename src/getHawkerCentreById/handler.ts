import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import _ from "lodash";

import SingaporeHawkerCentre from "../../model/HawkerCentre";

export const getHawkerCentreById: APIGatewayProxyHandlerV2 = async (
  event: APIGatewayProxyEventV2
) => {
  let response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "getHawkerCentreById",
      hawkerCentre: {},
    }),
  };

  if (event.pathParameters) {
    const id = event.pathParameters.id;
    if (id) {
      const singaporeHawkerCentre = await SingaporeHawkerCentre.query({
        id: { eq: id },
      })
        .all()
        .exec();
      const singaporeHawkerCentreObj = singaporeHawkerCentre.toJSON();

      response = {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "getHawkerCentreById",
          hawkerCentre: !_.isEmpty(singaporeHawkerCentreObj)
            ? singaporeHawkerCentreObj[0]
            : {},
        }),
      };
    }
  }

  return response;
};
