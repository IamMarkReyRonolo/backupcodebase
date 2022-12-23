import axios from "axios";
const url = "http://localhost:8000/question";
axios.defaults.headers.common["Authorization"] =
	"Bearer " + localStorage.getItem("token");

export default class API {
	async createCollegeQuestion(newQuestion) {
		const user = await axios.post(url + "/college/create", newQuestion);
		return user;
	}
	async createStaarQuestion(newQuestion) {
		const user = await axios.post(url + "/staar/create", newQuestion);
		return user;
	}
	async createMathWorldQuestion(newQuestion) {
		const user = await axios.post(url + "/mathworld/create", newQuestion);
		return user;
	}

	async getAllQuestions(params) {
		let questions = {};
		if (params) {
			questions = await axios.get(url + "/fetch/all" + params);
		} else {
			questions = await axios.get(url + "/fetch/all");
		}

		return questions.data;
	}

	async getQuestionById(id) {
		const question = await axios.get(url + "/fetch/" + id);

		return question.data;
	}

	async updateSTAARQuestion(id, updatedQuestion) {
		const user = await axios.put(url + `/update/staar/${id}`, updatedQuestion);
		return user;
	}

	async updateCollegeQuestion(id, updatedQuestion) {
		const user = await axios.put(
			url + `/update/college/${id}`,
			updatedQuestion
		);
		return user;
	}

	async updateMathWorldQuestion(id, updatedQuestion) {
		console.log(id);
		const user = await axios.put(
			url + `/update/mathworld/${id}`,
			updatedQuestion
		);
		return user;
	}

	async deleteQuestion(question_id) {
		const user = await axios.delete(url + `/delete/${question_id}`);
		return user;
	}
}
