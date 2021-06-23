import axios from "axios";
import dynamoose from "dynamoose";
dynamoose.aws.sdk.config.update({
  accessKeyId: process.env.MY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  region: "ap-southeast-1",
});
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import SingaporeHawkerCentre from "../model/HawkerCentre";
import { HawkerCentre, Record } from "../interface/hawkerCentre";

const ROOT_URL = "https://data.gov.sg";

export async function main(): Promise<void> {
  let loopStatus = true;

  while (loopStatus) {
    const finishStatus = await fetchHawkerCentreData();
    if (finishStatus) {
      loopStatus = false;
    }
  }
}

export async function fetchHawkerCentreData(): Promise<boolean> {
  let finishStatus = false;

  let offset = 0;

  const response = await axios.get(`${ROOT_URL}/api/action/datastore_search`, {
    params: {
      resource_id: "8f6bba57-19fc-4f36-8dcf-c0bda382364d",
      offset: offset,
    },
  });
  if (response) {
    const responseData: HawkerCentre = response.data;
    if (responseData && responseData.success) {
      const recordList = responseData.result.records;
      if (!_.isEmpty(recordList)) {
        await storeDataToSingaporeHawkerCentre(recordList);
        offset += 100;
      } else {
        finishStatus = true;
      }
    }
  }

  return finishStatus;
}

async function storeDataToSingaporeHawkerCentre(recordList: Record[]) {
  if (recordList) {
    for (let index = 0; index < recordList.length; index++) {
      const item = recordList[index];

      const condition = new dynamoose.Condition()
        .where("name_of_centre")
        .contains(item.name_of_centre);

      const singaporeHawkerCentre = await SingaporeHawkerCentre.scan(condition)
        .all()
        .exec();
      const singaporeHawkerCentreList = singaporeHawkerCentre.toJSON();

      if (_.isEmpty(singaporeHawkerCentreList)) {
        const singaporeHawkerCentreObj = new SingaporeHawkerCentre({
          id: uuidv4(),
          owner: item.owner,
          type_of_centre: item.type_of_centre,
          name_of_centre: item.name_of_centre,
          no_of_stalls: parseInt(item.no_of_stalls, 10),
          no_of_mkt_produce_stalls: parseInt(item.no_of_mkt_produce_stalls, 10),
          no_of_cooked_food_stalls: parseInt(item.no_of_cooked_food_stalls, 10),
          location_of_centre: item.location_of_centre,
        });
        await singaporeHawkerCentreObj.save();
      }
    }
  }
}
