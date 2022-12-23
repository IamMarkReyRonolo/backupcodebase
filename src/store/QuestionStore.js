import { defineStore } from "pinia";
import QuestionsAPI from "../api/QuestionsAPI";
export const useQuestionStore = defineStore("questionStore", {
	state: () => ({
		questions: [],
		fetchedQuestions: [],
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
	}),
	getters: {
		all() {
			return this.questions;
		},
	},
	actions: {
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
				this.fetched = false;
				const result = await QuestionsAPI.prototype.deleteQuestion(question_id);
				this.fetchedQuestions = this.fetchedQuestions.filter((question) => {
					return question.uuid != question_id;
				});
				this.total_number_of_questions = this.total_number_of_questions - 1;
				this.resetPanels = true;

				setTimeout(() => {
					this.resetPanels = false;
				}, 100);

				if (this.fetchedQuestions.length == 0) {
					if (this.current_page == 1) {
						this.current_page = 1;
					} else {
						this.current_page = this.current_page - 1;
					}

					this.pageChanged = true;
					await this.getQuestions();
				}

				this.fetched = result;
				this.error = null;
			} catch (error) {
				this.error = error;
			}

			this.questionDelete = true;
			setTimeout(() => {
				this.questionDelete = false;
			}, 1000);
		},
	},
});
