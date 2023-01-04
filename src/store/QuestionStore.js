import { defineStore } from "pinia";
import QuestionsAPI from "../api/QuestionsAPI";
export const useQuestionStore = defineStore("questionStore", {
	state: () => ({
		questions: [],
		createQuestion: {
			question_type: "",
			question_img: "",
			response_type: "Open Response Exact",
			question_content: "",
			status: "Pending",
			metadata: {},
			options: [
				{
					letter: "A",
					image: "",
					is_answer: true,
					content: "",
					unit: "",
				},
			],
		},
		chosenQuestion: {},
		updatedQuestion: {},
		fetchedQuestions: [],
		loadingCreate: false,
		errorCreate: false,
		snackbar: false,
		message: "",
		status: "",
		loading: false,
		fetched: false,
		error: null,
		filters: {},
		current_page: 1,
		total_number_of_questions: 0,
		total_pages: 1,
		pageChanged: false,
		filterChanged: false,
		pagination_filter: {},
		resetPanels: false, // on delete function
		openPanel: false,
		questionDelete: false,
		updateSuccess: false,
		createSuccess: false,
	}),
	getters: {
		all() {
			return this.questions;
		},
	},
	actions: {
		resetCreateQuestion() {
			this.createQuestion = {
				question_type: "STAAR",
				question_img: "",
				response_type: "Open Response Exact",
				question_content: "",
				status: "Pending",
				metadata: {
					grade_level: 3,
					release_date: "",
				},
				options: [
					{
						letter: "A",
						image: "",
						is_answer: true,
						content: "",
						unit: "",
					},
				],
			};
		},
		filterQuestions(filters) {
			this.filters = filters;
			this.filterChanged = true;
			this.current_page = 1;
			this.getQuestions();
		},

		pageChange(page) {
			const new_total_pages = Math.ceil(this.total_number_of_questions / 2);
			if (new_total_pages >= page) {
				this.current_page = page;
			} else {
				this.current_page = new_total_pages;
			}

			this.pageChanged = true;
			this.getQuestions();
		},

		async getQuestions() {
			this.openPanel = false;
			let params = "";

			if (this.filters.question_type == "All") {
				this.filters.question_type = "";
			}

			if (this.filters.response_type == "All") {
				this.filters.response_type = "";
			}

			if (this.filters.question_type && this.filters.response_type) {
				params = `?question_type=${this.filters.question_type}&response_type=${this.filters.response_type}`;
			} else if (this.filters.question_type && !this.filters.response_type) {
				params = `?question_type=${this.filters.question_type}`;
			} else if (!this.filters.question_type && this.filters.response_type) {
				params = `?response_type=${this.filters.response_type}`;
			}

			if (
				this.pageChanged &&
				!this.filters.question_type &&
				!this.filters.response_type
			) {
				params = `?page_num=${this.current_page}`;
				this.pageChanged = false;
			} else if (this.pageChanged && this.filterChanged) {
				params += `&page_num=${this.current_page}`;
				this.pageChanged = false;
			}

			try {
				this.fetched = false;
				this.loading = true;
				this.error = null;
				const questions = await QuestionsAPI.prototype.getAllQuestions(params);
				this.fetched = true;
				this.loading = false;
				this.fetchedQuestions = questions.data;
				this.total_pages = questions.no_of_pages;
				this.pagination_filter = questions.pagination_filter;
				this.total_number_of_questions = questions.total;
				this.current_page = questions.page;

				if (!this.pagination_filter.question_type) {
					this.filters.question_type = "All";
				}

				if (!this.pagination_filter.response_type) {
					this.filters.response_type = "All";
				}
			} catch (error) {
				this.loading = false;
				this.error = error;
			}
		},

		async getSpecificQuestion(id) {
			try {
				this.fetched = false;
				this.loading = true;
				this.error = null;
				const question = await QuestionsAPI.prototype.getQuestionById(id);
				this.fetchedQuestions = [question.Question];
				this.total_pages = 1;
				this.total_number_of_questions = 1;
				this.current_page = 1;
				this.openPanel = true;

				this.fetched = true;
				this.loading = false;
				this.error = null;
			} catch (error) {
				this.fetched = false;
				this.loading = false;
				this.error = error;
			}
		},

		async deleteQuestion(question_id) {
			try {
				this.error = null;
				const result = await QuestionsAPI.prototype.deleteQuestion(question_id);
				this.fetchedQuestions = this.fetchedQuestions.filter((question) => {
					return question.uuid != question_id;
				});
				this.total_number_of_questions = this.total_number_of_questions - 1;
				this.resetPanels = true;

				setTimeout(() => {
					this.resetPanels = false;
				}, 200);

				if (this.fetchedQuestions.length == 0) {
					if (this.current_page == 1) {
						this.current_page = 1;
					} else {
						this.current_page = this.current_page - 1;
					}

					this.pageChanged = true;
					await this.getQuestions();
				}

				this.error = null;
				this.openPanel = false;
			} catch (error) {
				this.error = error;
			}

			this.questionDelete = true;
			setTimeout(() => {
				this.questionDelete = false;
			}, 1000);
		},

		async createNewQuestion(from) {
			if (from == "create") {
				const fd = await this.convertToFormData(this.createQuestion);
				let result = null;
				if (this.createQuestion.question_type == "College Level") {
					result = await QuestionsAPI.prototype.createCollegeQuestion(fd);
				} else if (this.createQuestion.question_type == "MathWorld") {
					result = await QuestionsAPI.prototype.createMathWorldQuestion(fd);
				} else if (this.createQuestion.question_type == "STAAR") {
					result = await QuestionsAPI.prototype.createStaarQuestion(fd);
				}
			} else if (from == "update") {
				const fd = await this.convertToFormData(this.updatedQuestion);
				let result = null;
				if (this.updatedQuestion.question_type == "College Level") {
					result = await QuestionsAPI.prototype.createCollegeQuestion(fd);
				} else if (this.updatedQuestion.question_type == "MathWorld") {
					result = await QuestionsAPI.prototype.createMathWorldQuestion(fd);
				} else if (this.updatedQuestion.question_type == "STAAR") {
					result = await QuestionsAPI.prototype.createStaarQuestion(fd);
				}
			}
		},

		async updateQuestion() {
			const fd = await this.convertToFormData(this.updatedQuestion);
			let result = null;
			if (this.updatedQuestion.question_type == "College Level") {
				result = await QuestionsAPI.prototype.updateCollegeQuestion(
					this.updatedQuestion.uuid,
					fd
				);
			} else if (this.updatedQuestion.question_type == "MathWorld") {
				result = await QuestionsAPI.prototype.updateMathWorldQuestion(
					this.updatedQuestion.uuid,
					fd
				);
			} else if (this.updatedQuestion.question_type == "STAAR") {
				result = await QuestionsAPI.prototype.updateSTAARQuestion(
					this.updatedQuestion.uuid,
					fd
				);
			}
		},

		async convertToFormData(q) {
			try {
				const question = this.cloneObject(q);
				const fd = new FormData();

				if (question.question_img != "") {
					const image = await this.getBlobFromUrl(question.question_img);

					fd.append("question_image", image, "question_image.jpg");
					question.question_img = "";
				}

				for (let i = 0; i < question.options.length; i++) {
					if (question.options[i].image != "") {
						const image = await this.getBlobFromUrl(question.options[i].image);

						fd.append("option_images", image, `option_image${i}.jpg`);
						question.options[i].image = "";
					}
				}

				const questionPayload = Object.assign({}, question);

				Object.entries(questionPayload.metadata).forEach((item) => {
					if (item[0] != "uuid" && item[0] != "question_id") {
						questionPayload[item[0]] = item[1];
					}
				});

				questionPayload.metadata = {};

				fd.append("data", JSON.stringify(questionPayload));
				return fd;
			} catch (error) {
				console.log(error);
			}
		},

		cloneObject(question) {
			const q = JSON.parse(JSON.stringify(question));

			q.metadata = JSON.parse(JSON.stringify(question.metadata));

			q.options = [];
			question.options.forEach((element) => {
				q.options.push(JSON.parse(JSON.stringify(element)));
			});
			return q;
		},

		getBlobFromUrl(myImageUrl) {
			return new Promise((resolve, reject) => {
				let request = new XMLHttpRequest();
				request.open("GET", myImageUrl, true);
				request.responseType = "blob";
				request.onload = () => {
					resolve(request.response);
				};
				request.onerror = reject;
				request.send();
			});
		},
	},
});
