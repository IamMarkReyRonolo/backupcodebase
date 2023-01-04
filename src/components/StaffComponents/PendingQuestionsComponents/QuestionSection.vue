<template>
	<div class="questionSection">
		<div class="resultsList">
			<v-expansion-panels
				focusable
				:flat="true"
				:mandatory="questionStore.openPanel"
			>
				<v-expansion-panel v-for="(question, i) in getQuestions" :key="i">
					<v-expansion-panel-header
						v-if="question.question_type == 'STAAR'"
						:id="'questionSTAAR-id' + i"
						@click="toggleQuestion(question.uuid)"
						:class="
							toggleHeader && toggID == question.uuid ? 'clickedHeader' : ''
						"
					>
						<div
							class="questionHeader"
							:class="
								toggleHeader && toggID == question.uuid ? 'clickedHeader' : ''
							"
						>
							<v-badge
								bordered
								color="success"
								left
								content="new"
								v-if="indicate(question) && !question.updated_by"
							>
								<v-chip color="#4C5B77" dark>STAAR</v-chip>
							</v-badge>
							<v-badge
								bordered
								color="#5A6882"
								left
								content="mod"
								v-else-if="indicate(question) && question.updated_by"
							>
								<v-chip color="#4C5B77" dark>STAAR</v-chip>
							</v-badge>

							<v-chip color="#4C5B77" dark v-else>STAAR</v-chip>

							<div class="details">
								<div class="detail">
									<div class="label">Release Date</div>
									<div class="value">
										{{ question.metadata.release_date }}
									</div>
								</div>
								<div class="detail">
									<div class="label">Grade Level</div>
									<div class="value">
										Grade {{ question.metadata.grade_level }}
									</div>
								</div>
								<!-- <div class="detail smallView">
									<div class="label">Id</div>
									<div class="value">{{ question.uuid }}</div>
								</div> -->
							</div>
							<v-spacer></v-spacer>
							<div class="keywords">
								<div class="label">Keywords</div>
								<div class="value">No Keywords</div>
							</div>
						</div>
					</v-expansion-panel-header>

					<v-expansion-panel-header
						v-if="question.question_type == 'College Level'"
						:id="'questionCollege-id' + i"
					>
						<div class="questionHeader">
							<v-badge
								bordered
								color="success"
								left
								content="new"
								v-if="indicate(question) && !question.updated_by"
							>
								<v-chip color="#4C5B77" dark>College Level</v-chip>
							</v-badge>

							<v-badge
								bordered
								color="#5A6882"
								left
								content="mod"
								v-else-if="indicate(question) && question.updated_by"
							>
								<v-chip color="#4C5B77" dark>College Level</v-chip>
							</v-badge>

							<v-chip color="#4C5B77" dark v-else>College Level</v-chip>
							<div class="details">
								<div class="detail">
									<div class="label">Classification</div>
									<div class="value">
										{{ question.metadata.classification }}
									</div>
								</div>
								<div class="detail">
									<div class="label">Test Code</div>
									<div class="value">{{ question.metadata.test_code }}</div>
								</div>
								<!-- <div class="detail smallView">
									<div class="label">Id</div>
									<div class="value">{{ question.uuid }}</div>
								</div> -->
							</div>
							<v-spacer></v-spacer>
							<div class="keywords">
								<div class="label">Keywords</div>
								<div class="value">No Keywords</div>
							</div>
						</div>
					</v-expansion-panel-header>

					<v-expansion-panel-header
						v-if="question.question_type == 'MathWorld'"
						:id="'questionMathWorld-id' + i"
					>
						<div class="questionHeader">
							<v-badge
								bordered
								color="success"
								left
								content="new"
								v-if="indicate(question) && !question.updated_by"
							>
								<v-chip color="#4C5B77" dark>MathWorld</v-chip>
							</v-badge>

							<v-badge
								bordered
								color="#5A6882"
								left
								content="mod"
								v-else-if="indicate(question) && question.updated_by"
							>
								<v-chip color="#4C5B77" dark>MathWorld</v-chip>
							</v-badge>

							<v-chip color="#4C5B77" dark v-else>MathWorld</v-chip>
							<div class="details">
								<div class="detail">
									<div class="label">TEKS Code</div>
									<div class="value">{{ question.metadata.teks_code }}</div>
								</div>
								<div class="detail">
									<div class="label">Subject</div>
									<div class="value">{{ question.metadata.subject }}</div>
								</div>
								<!-- <div class="detail smallView">
									<div class="label">Grade Level</div>
									<div class="value">
										Grade {{ question.metadata.grade_level }}
									</div>
								</div> -->
								<!-- <div class="detail smallView">
									<div class="label">Category</div>
									<div class="value">{{ question.metadata.category }}</div>
								</div>
								<div class="detail smallView">
									<div class="label">Topic</div>
									<div class="value">{{ question.metadata.topic }}</div>
								</div> -->
								<!-- <div class="detail smallView">
									<div class="label">Id</div>
									<div class="value">{{ question.uuid }}</div>
								</div> -->
							</div>
							<v-spacer></v-spacer>
							<div class="keywords">
								<div class="label">Keywords</div>
								<div class="value">
									<span
										v-for="(keyword, index) in question.metadata.keywords"
										:key="index"
										>{{ keyword }},</span
									>
								</div>
							</div>
						</div>
					</v-expansion-panel-header>

					<v-expansion-panel-content eager>
						<div class="questionContent" v-if="render">
							<br />
							<div class="question">
								<div class="questionTitle">Question:</div>
								<div class="questionContentCon">
									<vue-mathjax
										:formula="question.question_content"
										v-if="render"
									></vue-mathjax>
								</div>
							</div>
							<div class="imgQuestion" v-if="question.question_img">
								<img :src="question.question_img" alt="" />
							</div>

							<div v-if="question.response_type == 'Open Response Exact'">
								<div
									class="options"
									v-for="(option, i) in question.options"
									:key="i"
								>
									<div class="answerTitleCon">Answer:</div>
									<div class="answerContentCon">
										<span style="padding: 0px 5px"
											><vue-mathjax :formula="option.content"></vue-mathjax
										></span>
										<span
											><vue-mathjax :formula="option.unit"></vue-mathjax
										></span>
										<span style="padding: 0px 10px" v-if="option.is_answer"
											><strong>Correct Answer</strong></span
										>
									</div>
								</div>
							</div>

							<div v-if="question.response_type == 'Range Open Response'">
								<div
									class="options"
									v-for="(option, i) in question.options"
									:key="i"
								>
									<span style="padding-left: 20px" v-if="option.letter == 'A'"
										>Min:</span
									>
									<span style="padding-left: 20px" v-if="option.letter == 'B'"
										>Max:</span
									>
									<span style="padding: 0px 5px"
										><vue-mathjax :formula="option.content"></vue-mathjax
									></span>
									<span><vue-mathjax :formula="option.unit"></vue-mathjax></span
									><span v-if="option.is_answer" style="padding: 0px 10px"
										><strong>Correct Answer</strong></span
									>
								</div>
							</div>

							<div
								v-if="
									question.response_type == 'Multiple Choice' ||
									question.response_type == 'Checkboxes'
								"
								class="itemChoices"
							>
								<div
									class="options"
									v-for="(option, i) in question.options"
									:key="i"
								>
									<span style="padding-left: 20px">{{ option.letter }}.</span>
									<span style="padding: 0px 5px"
										><vue-mathjax :formula="option.content"></vue-mathjax></span
									><span
										><vue-mathjax :formula="option.unit"></vue-mathjax></span
									><span v-if="option.is_answer" style="padding: 0px 10px"
										><strong>Correct Answer</strong></span
									>

									<div class="optionQuestion" v-if="option.image != ''">
										<img :src="option.image" alt="" />
									</div>
								</div>
							</div>

							<br />
							<br />

							<div class="footer">
								<div class="additionalDetails">
									<div class="addDetail">
										<div class="detailLabel">Created by</div>

										<div class="detailValue">{{ question.created_by }}</div>
									</div>
									<div class="addDetail smallView">
										<div class="detailLabel">Created at</div>

										<div class="detailValue">
											{{ getLocalDate(question.created_at) }}
										</div>
									</div>
									<div class="addDetail" v-if="question.updated_by">
										<div class="detailLabel">Updated by</div>

										<div class="detailValue">{{ question.updated_by }}</div>
									</div>
									<div class="addDetail smallView" v-if="question.updated_by">
										<div class="detailLabel">Updated at</div>

										<div class="detailValue">
											{{ getLocalDate(question.updated_at) }}
										</div>
									</div>
								</div>

								<div class="btnsCon">
									<v-btn
										text
										color="error"
										@click="activateDeleteDialog(question.uuid)"
										:id="'deleteQuestionId' + i + 'Btn'"
										>Delete</v-btn
									>
									<v-btn
										color="#4c5b77"
										dark
										:id="'editQuestionId' + i + 'Btn'"
										@click="activateUpdateDialog(question)"
										>Edit</v-btn
									>
								</div>
							</div>
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
		</div>

		<DeleteQuestion
			:deleteDialog="deleteDialog"
			v-if="deleteDialog"
			@cancelDelete="deleteDialog = false"
			@deleteConfirmed="deleteQuestion"
			:message="message"
			:title="'Delete Question?'"
			:loading="loadingDialog"
		/>

		<UpdateQuestion
			:updateDialog="updateDialog"
			v-if="updateDialog"
			@closeUpdate="closeUpdate"
		/>
	</div>
</template>

<script>
	import { VueMathjax } from "vue-mathjax";
	import DeleteQuestion from "../../GeneralModals/DeleteModal.vue";
	import Snackbar from "../../GeneralModals/Snackbar.vue";
	import UpdateQuestion from "../../GeneralModals/UpdateQuestion.vue";
	import { useQuestionStore } from "../../../store/QuestionStore";
	export default {
		components: {
			"vue-mathjax": VueMathjax,
			DeleteQuestion,
			UpdateQuestion,
			Snackbar,
		},
		data: () => ({
			questionStore: useQuestionStore(),
			questions: [],
			question_id: null,
			deleteDialog: false,
			updateDialog: false,
			list_updated: false,
			question: {},
			message: "",
			render: true,
			status: "",
			value: "new",
			loadingDialog: false,
			snackbar: false,
			toggleHeader: false,
			toggID: "",
		}),
		methods: {
			toggleQuestion(id) {
				if (id == this.toggID) {
					this.toggleHeader = false;
					this.toggID = "";
				} else {
					this.toggleHeader = true;
					this.toggID = id;
				}
			},
			activateDeleteDialog(question_id) {
				this.message =
					"Are you sure you want to delete this question? This action cannot be undone.";
				this.question_id = question_id;
				this.deleteDialog = true;
			},
			async deleteQuestion() {
				this.loadingDialog = true;
				await this.questionStore.deleteQuestion(this.question_id);
				this.loadingDialog = false;
				this.deleteDialog = false;
			},

			updateQuestion(parameters) {
				this.updateDialog = false;
				this.$emit("updateQuestion", parameters);
			},

			activateUpdateDialog(question) {
				this.updateDialog = true;
				this.questionStore.chosenQuestion = question;
				this.render = false;
			},

			closeUpdate(parameters) {
				this.updateDialog = false;
				this.render = true;

				if (parameters.message == "created") {
					parameters.message = "Successfully added to the database";
					parameters.status = "Success";
				} else if (parameters.message == "updated") {
					parameters.message = "Question successfully updated";
					parameters.status = "Success";
				}

				this.updateQuestion(parameters);
			},

			indicate(question) {
				let utc_date = question.updated_at + "Z";
				let current_date = new Date().getTime();
				let question_date = new Date(utc_date).getTime();
				let minute = 60000;

				const time_difference = (current_date - question_date) / minute;
				return time_difference < 1;
			},

			getLocalDate(date) {
				let utc_date = date + "Z";
				let local_date = new Date(utc_date);

				var hours = local_date.getHours();
				var minutes = local_date.getMinutes();
				var ampm = hours >= 12 ? "pm" : "am";
				hours = hours % 12;
				hours = hours ? hours : 12; // the hour '0' should be '12'
				minutes = minutes < 10 ? "0" + minutes : minutes;
				var strTime = hours + ":" + minutes + " " + ampm;
				return local_date.toDateString() + " - " + strTime;
			},
		},
		computed: {
			getQuestions: function () {
				this.questions = this.questionStore.fetchedQuestions.slice();
				return this.questions;
			},
		},
	};
</script>

<style scoped>
	.resultsList {
		padding: 10px 10px;
		overflow: auto;
	}

	.v-expansion-panel {
		margin: 2px 0px;
	}

	.v-expansion-panel--active {
		margin: 20px 0px;
	}

	.v-expansion-panel-header {
		padding: 0px;
	}

	.questionHeader {
		padding: 25px;
		display: flex;
		align-items: center;
		color: #4c5b77;
	}

	.details {
		display: flex;
		align-items: center;
		padding: 0px 10px;
	}

	.detail,
	.keywords {
		padding: 0px 10px;
	}

	.label {
		font-size: 12px;
		padding: 5px 0px;
		font-weight: bold;
	}

	.value {
		font-weight: lighter;
	}

	/*  */

	.question {
		padding: 10px;
	}

	.question .questionTitle,
	.answerTitleCon {
		font-weight: bold;
		font-size: 19px;
		padding: 10px;
	}

	.question .questionContentCon,
	.answerContentCon {
		font-weight: 500;
		font-size: 18px;
		padding: 10px;
	}

	/* .itemChoices {
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
		flex-wrap: wrap;
		width: 800px;
	} */

	.options {
		padding: 5px 10px;
		font-size: 18px;
	}

	.questionContent {
		color: #4c5b77;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.additionalDetails {
		display: flex;
	}

	.addDetail {
		padding: 0px 10px;
	}

	.detailLabel {
		font-size: 12px;
		font-weight: bold;
	}

	.detailValue {
		font-size: 14px;
	}

	.indicator {
		margin-top: -20px;
		border: 1px solid black;
		width: 10px;
		height: 10px;
	}

	.imgQuestion,
	.optionQuestion {
		width: 300px;
		margin: 10px;
		margin-bottom: 40px;
		border-radius: 10px;
		color: #4b5a76;
		background-color: #dfdfdf;
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
			0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		transition-duration: 0.28s;
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	.optionQuestion img {
		width: 300px;
		padding: 10px;
	}

	.imgQuestion img {
		width: 300px;
		padding: 10px;
	}

	.clickedHeader {
		background-color: #7486a8;
		color: white;
	}

	.v-expansion-panel-header:hover {
		background-color: #6f85ad6c;
	}

	.v-expansion-panel-header {
		transition: 0.2s ease-in-out;
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.1s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}

	@media only screen and (max-width: 850px) {
		.resultsList {
			padding: 0px;
			padding-top: 20px;
		}

		.questionHeader {
			padding: 25px;
			font-size: 10px;
		}

		.keywords {
			display: none;
		}

		.addDetail {
			padding: 0px 5px;
		}

		.detailLabel {
			font-size: 10px;
		}

		.detailValue {
			font-size: 10px;
		}

		.label {
			font-size: 10px;
			padding: 2px 0px;
		}

		.value {
			font-size: 10px;
			font-weight: lighter;
		}

		.v-chip {
			font-size: 10px;
			padding: 0px 5px;
		}

		.v-chip .v-chip__content {
			padding: 0px;
		}

		.v-chip.v-size--default {
			height: 24px;
		}

		.btnsCon .v-btn {
			font-size: 10px;
			padding: 0px;
			height: 25px;
		}

		.question {
			font-size: 12px;
		}

		.options {
			font-size: 12px;
		}

		.optionQuestion img {
			width: 300px;
		}

		.imgQuestion img {
			width: 300px;
		}
	}

	@media only screen and (max-width: 600px) {
		/* .v-expansion-panel-header {
			padding: 10px;
		} */
		.smallView {
			display: none;
		}

		.v-badge__badge {
			font-size: 8px;
			height: 15px;
		}

		.optionQuestion img {
			width: 200px;
		}

		.imgQuestion {
			padding-bottom: 50px;
		}

		.imgQuestion img {
			width: 200px;
		}
	}
</style>
