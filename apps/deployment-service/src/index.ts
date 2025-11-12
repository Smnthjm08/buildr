import { createClient } from "redis";

// TODO redis production config
const subscriber = createClient();

subscriber.connect();

function downloadCodeFromS3(deploymentID: string) {
  return deploymentID;
}

async function startDeploymentServer() {
  while (true) {
    const response = await subscriber.brPop("deployment-id", 0);
    console.log("=======\n\n", response);
    console.log("=======\n\n", typeof response?.element);

    const deploymentId = response?.element;

    if (!deploymentId) {
      // No id; wait for next message
      continue;
    }

    // TODO deployment service
    const project = downloadCodeFromS3(deploymentId);
    console.log("project", project);
  }
}

startDeploymentServer();
