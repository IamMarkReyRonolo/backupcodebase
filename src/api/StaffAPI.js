import axios from "axios";
const url = "http://localhost:8000/staff";

export default class API {
	async login(credentials) {
		axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const user = await axios.post(url + "/login", credentials);
		console.log(user);
		return user;
	}
	async register(staff) {
		axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const user = await axios.post(url + "/register", staff);
		return user;
	}
	async getUserData() {
		axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const user = await axios.get(url + "/user_data");
		return user;
	}

	async getAllStaff(params) {
		console.log("hellooooo");
		let staff = {};
		if (params) {
			staff = await axios.get(url + "/all" + params);
		} else {
			staff = await axios.get(url + "/all");
		}

		return staff.data;
	}

	async getCount() {
		axios.defaults.headers.common["Authorization"] =
			"Bearer " + JSON.parse(localStorage.getItem("token"));
		const user = await axios.get(url + "/get_people_count");
		return user.data;
	}

	async getSpecificStaff(uuid) {
		const staff = await axios.get(url + "/specific/" + uuid);
		return staff.data;
	}

	async updatePersonalDetails(updatedDetails) {
		const staff = await axios.put(
			url + `/update_details/${updatedDetails.uuid}`,
			updatedDetails
		);
		return staff;
	}

	async changePassword(changedCredentials, uuid) {
		const staff = await axios.put(
			url + `/change_password/${uuid}`,
			changedCredentials
		);
		return staff;
	}

	async updateStaffDetails(updatedStaff) {
		const staff = await axios.put(
			url + `/update_staff_details/${updatedStaff.uuid}`,
			updatedStaff
		);
		return staff;
	}

	async changeStaffPassword(changedCredentials) {
		const staff = await axios.put(
			url + `/change_staff_password/${changedCredentials.uuid}`,
			changedCredentials
		);
		return staff;
	}

	async deleteStaff(uuid) {
		const user = await axios.delete(url + `/delete/${uuid}`);
		return user;
	}
}
