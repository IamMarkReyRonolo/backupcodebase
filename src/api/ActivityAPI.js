import axios from "axios";
const url = "http://localhost:8000/activity";

export default class API {
	async getActivities() {
    axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const activities = await axios.get(url + "/all");
		return activities.data;
	}
}
