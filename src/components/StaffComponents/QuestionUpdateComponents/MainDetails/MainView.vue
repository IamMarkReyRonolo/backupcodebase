<template>
	<div class="questionCreation">
		{{ listenForChanges }}

		<QuestionPreview />
		<MainQuestionDetails />
		<div>
			<OpenResponseExact
				v-if="
					questionStore.updatedQuestion.response_type == 'Open Response Exact'
				"
			/>
			<OpenResponseRange
				v-if="
					questionStore.updatedQuestion.response_type == 'Range Open Response'
				"
			/>
			<MultipleChoice
				v-if="questionStore.updatedQuestion.response_type == 'Multiple Choice'"
			/>
			<Checkboxes
				v-if="questionStore.updatedQuestion.response_type == 'Checkboxes'"
			/>
		</div>

		<div class="controlBtns large">
			<v-btn large text color="#5a6882" @click="proceedSubmit = true"
				>Create as New</v-btn
			>
			<v-btn
				:disabled="!proceed"
				:dark="proceed"
				large
				color="#5a6882"
				@click="proceedUpdate = true"
				>Update Question</v-btn
			>
		</div>

		<div class="controlBtns small">
			<v-btn
				large
				color="#5a6882"
				:dark="proceed"
				block
				:disabled="!proceed"
				@click="proceedUpdate = true"
				>Update Question</v-btn
			>
			<v-btn large text color="#5a6882" block @click="proceedSubmit = true"
				>Create as New</v-btn
			>
		</div>

		<UpdateNote
			v-if="proceedUpdate"
			:proceedUpdate="proceedUpdate"
			@cancelUpdate="proceedUpdate = false"
		/>

		<Confirm
			v-if="proceedSubmit"
			:confirmSubmission="proceedSubmit"
			@proceedSubmission="createNewQuestion"
			@cancelSubmission="proceedSubmit = false"
			:mode="mode"
		/>

		<Processing :loadingDialog="loading" v-if="loading" />

		<Snackbar
			:snackbar="snackbar"
			:message="message"
			:status="status"
			v-if="snackbar"
			@closeSnackbar="snackbar = false"
		/>
	</div>
</template>

<script>
	import OpenResponseExact from "./ResponseTypes/OpenResponseExact.vue";
	import OpenResponseRange from "./ResponseTypes/OpenResponseRange.vue";
	import MultipleChoice from "./ResponseTypes/MultipleChoice.vue";
	import Checkboxes from "./ResponseTypes/Checkboxes.vue";
	import QuestionPreview from "./QuestionPreview.vue";
	import MainQuestionDetails from "./MainQuestionDetails.vue";
	import UpdateNote from "../../../GeneralModals/UpdateNote";
	import Confirm from "../../../GeneralModals/Confirm";
	import Processing from "../../../GeneralModals/Processing";
	import Snackbar from "../../../GeneralModals/Snackbar";
	import { useQuestionStore } from "../../../../store/QuestionStore";
	export default {
		components: {
			OpenResponseExact,
			OpenResponseRange,
			MultipleChoice,
			Checkboxes,
			QuestionPreview,
			MainQuestionDetails,
			UpdateNote,
			Processing,
			Confirm,
			Snackbar,
		},

		async created() {},
		data() {
			return {
				questionStore: useQuestionStore(),
				fetched: true,
				loading: false,
				error: false,
				hasChanges: false,
				proceed: false,
				proceedUpdate: false,
				proceedSubmit: false,
				mode: "create",
				snackbar: false,
				message: "",
				status: "",
			};
		},
		methods: {
			async createNewQuestion() {
				try {
					this.loading = true;
					await this.questionStore.createNewQuestion("update");
					this.questionStore.createSuccess = true;
					this.loading = false;
				} catch (error) {
					this.error = true;
					this.loading = false;
					this.message =
						"An error occured while creating the question. Please try again.";
					this.snackbar = true;
					this.status = "Error";
				}
			},
			validateChanges() {
				let is_proceed = true;
				Object.entries(this.questionStore.updatedQuestion).forEach((item) => {
					if (!item[1]) {
						if (
							item[0] == "question_img" ||
							item[0] == "options" ||
							item[0] == "reviewed_by" ||
							item[0] == "updated_by"
						) {
						} else {
							is_proceed = false;
						}
					}
				});

				Object.entries(this.questionStore.updatedQuestion.metadata).forEach(
					(item) => {
						if (!item[1]) {
							is_proceed = false;
						}
					}
				);

				if (
					this.questionStore.updatedQuestion.question_type == "College Level"
				) {
					if (
						this.questionStore.updatedQuestion.metadata.test_code.length > 6
					) {
						is_proceed = false;
					}
				}

				if (this.questionStore.updatedQuestion.question_type == "MathWorld") {
					if (
						this.questionStore.updatedQuestion.metadata.teks_code.length > 6
					) {
						is_proceed = false;
					}

					if (
						this.questionStore.updatedQuestion.metadata.points < 0 ||
						this.questionStore.updatedQuestion.metadata.points > 100
					) {
						is_proceed = false;
					}
				}

				if (is_proceed) {
					this.checkOptions();
					if (this.proceed) {
						this.checkForModifications();
					}
				} else {
					this.proceed = is_proceed;
				}
			},

			checkOptions() {
				let is_proceed = true;
				let has_answer = false;

				if (this.questionStore.updatedQuestion.options) {
					Object.entries(this.questionStore.updatedQuestion.options).forEach(
						(item) => {
							if (!item[1].content) {
								is_proceed = false;
							}
						}
					);
					if (
						this.questionStore.updatedQuestion.response_type == "Checkboxes" &&
						is_proceed
					) {
						Object.entries(this.questionStore.updatedQuestion.options).forEach(
							(item) => {
								if (item[1].is_answer) {
									has_answer = true;
								}
							}
						);

						if (!has_answer) {
							is_proceed = false;
						}
					}

					if (
						this.questionStore.updatedQuestion.response_type ==
							"Range Open Response" &&
						is_proceed
					) {
						if (this.questionStore.updatedQuestion.options.length < 2) {
							is_proceed = false;
						} else {
							if (
								!isNaN(
									Number(this.questionStore.updatedQuestion.options[0].content)
								) &&
								!isNaN(
									Number(this.questionStore.updatedQuestion.options[1].content)
								)
							) {
								let num1 = parseFloat(
									this.questionStore.updatedQuestion.options[0].content
								);
								let num2 = parseFloat(
									this.questionStore.updatedQuestion.options[1].content
								);

								if (isNaN(num1) || isNaN(num2) || num1 >= num2) {
									is_proceed = false;
								}
							} else {
								is_proceed = false;
							}
						}
					}
				} else {
					is_proceed = false;
				}

				this.proceed = is_proceed;
			},

			checkForModifications() {
				if (
					JSON.stringify(this.questionStore.updatedQuestion) !=
					JSON.stringify(this.questionStore.chosenQuestion)
				) {
					this.proceed = true;
				} else {
					if (
						JSON.stringify(this.questionStore.updatedQuestion.options) !=
						JSON.stringify(this.questionStore.chosenQuestion.options)
					) {
						this.proceed = true;
					} else {
						this.proceed = false;
					}
				}

				// let has_modified = false;
				// Object.entries(this.questionStore.updatedQuestion).forEach(
				// 	([key, value]) => {
				// 		if (key in this.questionStore.chosenQuestion) {
				// 			if (key != "options") {
				// 				if (this.questionStore.chosenQuestion[key] != value) {
				// 					has_modified = true;
				// 				}
				// 			} else {
				// 				if (
				// 					JSON.stringify(value) !=
				// 					JSON.stringify(this.questionStore.chosenQuestion[key])
				// 				) {
				// 					has_modified = true;
				// 				}
				// 			}
				// 		}
				// 	}
				// );

				// if (has_modified) {
				// 	this.proceed = false;
				// } else {
				// 	this.proceed = true;
				// }
			},
		},

		computed: {
			listenForChanges: function () {
				this.validateChanges();
			},
		},
	};
</script>

<style scoped>
	.questionCreation {
		padding: 20px;
		min-width: 60%;
		width: 100%;
		height: 100vh;
		overflow-y: auto;
		max-height: 85vh;
	}

	.controlBtns {
		padding: 20px;
		margin-bottom: -50px;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}

	.small {
		padding: 80px 0px;
		display: none;
	}

	@media only screen and (max-width: 1000px) {
		.questionCreation {
			padding: 20px;
			padding-left: 70px;
		}
	}

	@media only screen and (max-width: 750px) {
		.questionCreation {
			padding: 30px;
			padding-left: 70px;
		}

		.large {
			display: none;
		}

		.small {
			display: block;
		}
	}

	@media only screen and (max-width: 540px) {
		.questionCreation {
			padding: 50px 10px;
		}
	}
</style>
