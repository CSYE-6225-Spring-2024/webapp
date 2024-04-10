const { PubSub } = require("@google-cloud/pubsub");
const { logger } = require("../../modules/logger/logging.js");

const pubsub = new PubSub({
  projectId: "csye6225-anirban-002979520",
});

const publishMesssgePubSub = async (topicName, userDetails) => {
  try {
    let userDetailsVersioned = { ...userDetails, version: "v2" };
    const jsonData = Buffer.from(JSON.stringify(userDetailsVersioned));
    const msgID = await pubsub
      .topic(topicName)
      .publishMessage({ data: jsonData });
    logger.info("Published message to pub-sub", {
      userID: userDetails.id,
      pubsubID: msgID,
    });
  } catch (error) {
    logger.error(
      "Failed to publish message to pub-sub with ID:",
      userDetails.id
    );
  }
};

module.exports = {
  publishMesssgePubSub,
};
