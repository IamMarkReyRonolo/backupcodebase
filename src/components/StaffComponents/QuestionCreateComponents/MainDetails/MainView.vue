<template>
	<div class="questionCreation">
		{{ listenForChanges }}
		<h1>Create Question</h1>
		<QuestionPreview />
		<MainQuestionDetails />
		<div>
			<OpenResponseExact
				v-if="
					questionStore.createQuestion.response_type == 'Open Response Exact'
				"
			/>
			<OpenResponseRange
				v-if="
					questionStore.createQuestion.response_type == 'Range Open Response'
				"
			/>
			<MultipleChoice
				v-if="questionStore.createQuestion.response_type == 'Multiple Choice'"
			/>
			<Checkboxes
				v-if="questionStore.createQuestion.response_type == 'Checkboxes'"
			/>
		</div>

		<div class="controlBtns large">
			<v-btn
				:disabled="!proceed"
				:dark="proceed"
				large
				color="#5a6882"
				@click="proceedSubmit = true"
				>Create Question</v-btn
			>
		</div>

		<div class="controlBtns small">
			<v-btn
				large
				color="#5a6882"
				:dark="proceed"
				block
				:disabled="!proceed"
				@click="proceedSubmit = true"
				>Create Question</v-btn
			>
		</div>

		<Confirm
			v-if="proceedSubmit"
			:confirmSubmission="proceedSubmit"
			@proceedSubmission="createNewQuestion"
			@cancelSubmission="proceedSubmit = false"
			:mode="mode"
		/>

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
	import Confirm from "../../../GeneralModals/Confirm.vue";
	import { useQuestionStore } from "../../../../store/QuestionStore";
	import Snackbar from "../../../GeneralModals/Snackbar";
	export default {
		components: {
			OpenResponseExact,
			OpenResponseRange,
			MultipleChoice,
			Checkboxes,
			QuestionPreview,
			MainQuestionDetails,
			Confirm,
			Snackbar,
		},

		async created() {
			console.log(this.questionStore.createQuestion);
		},
		data() {
			return {
				questionStore: useQuestionStore(),
				success: true,
				loading: false,
				error: false,
				hasChanges: false,
				proceed: false,
				proceedSubmit: false,
				mode: "create",
				snackbar: false,
				message: "",
			};
		},
		methods: {
			async createNewQuestion() {
				try {
					this.questionStore.loadingCreate = true;
					await this.questionStore.createNewQuestion("create");
					this.questionStore.resetCreateQuestion();
					this.questionStore.message = "Successfully created question";
					this.questionStore.snackbar = true;
					this.questionStore.status = "Success";
					this.questionStore.loadingCreate = false;
				} catch (error) {
					this.error = true;
					this.questionStore.loadingCreate = false;
					this.questionStore.message =
						"An error occured while creating the question. Please try again.";
					this.questionStore.snackbar = true;
					this.questionStore.status = "Error";
				}
			},
			validateChanges() {
				let is_proceed = true;

				Object.entries(this.questionStore.createQuestion).forEach((item) => {
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

				Object.entries(this.questionStore.createQuestion.metadata).forEach(
					(item) => {
						if (!item[1]) {
							is_proceed = false;
						}
					}
				);

				if (
					this.questionStore.createQuestion.question_type == "College Level"
				) {
					if (this.questionStore.createQuestion.metadata.test_code.length > 6) {
						is_proceed = false;
					}
				}

				if (this.questionStore.createQuestion.question_type == "MathWorld") {
					if (
						this.questionStore.createQuestion.metadata.teks_code.length > 6 ||
						this.questionStore.createQuestion.metadata.teks_code.length < 1
					) {
						is_proceed = false;
					}

					if (
						this.questionStore.createQuestion.metadata.points <= 0 ||
						this.questionStore.createQuestion.metadata.points > 100
					) {
						is_proceed = false;
					}
				}

				if (is_proceed) {
					this.checkOptions();
				} else {
					this.proceed = is_proceed;
				}
			},

			checkOptions() {
				let is_proceed = true;
				let has_answer = false;

				if (this.questionStore.createQuestion.options) {
					Object.entries(this.questionStore.createQuestion.options).forEach(
						(item) => {
							if (!item[1].content) {
								is_proceed = false;
							}
						}
					);
					if (
						this.questionStore.createQuestion.response_type == "Checkboxes" &&
						is_proceed
					) {
						Object.entries(this.questionStore.createQuestion.options).forEach(
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
						this.questionStore.createQuestion.response_type ==
							"Range Open Response" &&
						is_proceed
					) {
						if (this.questionStore.createQuestion.options.length < 2) {
							is_proceed = false;
						} else {
							if (
								!isNaN(
									Number(this.questionStore.createQuestion.options[0].content)
								) &&
								!isNaN(
									Number(this.questionStore.createQuestion.options[1].content)
								)
							) {
								let num1 = parseFloat(
									this.questionStore.createQuestion.options[0].content
								);
								let num2 = parseFloat(
									this.questionStore.createQuestion.options[1].content
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
		},

		computed: {
			listenForChanges: function () {
				this.validateChanges();
			},
		},
	};
</script>

<style scoped>
	h1 {
		font-weight: 500;
		color: #5a6882;
		padding-bottom: 10px;
	}

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
