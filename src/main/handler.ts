import { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const getMain: APIGatewayProxyHandlerV2 = async () => {
  const response = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "singapore-hawker-centre api",
    }),
  };
  return response;
};
