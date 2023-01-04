<template>
	<div class="createQuestion">
		{{ getQuestionData }}
		{{ listenForChanges }}
		<div class="largeConView" v-if="this.$vuetify.breakpoint.width > 1000">
			<v-navigation-drawer
				v-model="drawer"
				:mini-variant.sync="mini"
				permanent
				width="375"
			>
				<div class="drawer">
					<v-btn
						fab
						@click.stop="mini = !mini"
						filled
						class="drawerBtn"
						small
						id="drawerBtn"
					>
						<v-icon color="#4c5b77" v-if="mini">mdi-forwardburger</v-icon>
						<v-icon color="#4c5b77" v-if="!mini">mdi-backburger</v-icon>
					</v-btn>

					<DetailsSection
						v-if="!mini"
						:metaData="metaData"
						@getQuestionMetaData="getQuestionMetaData"
						:reset="reset"
					/>
				</div>
			</v-navigation-drawer>
		</div>

		<div class="smallConView" v-if="this.$vuetify.breakpoint.width <= 1000">
			<v-btn fab small id="drawerBtn"
				><v-icon color="#4c5b77" v-if="!openBurger" @click="clickNav('open')"
					>mdi-forwardburger</v-icon
				>
			</v-btn>

			<v-dialog
				v-model="openBurger"
				persistent
				fullscreen
				transition="dialog-left-transition"
			>
				{{ listenForMediaWidth }}
				<div class="navBarCon" v-if="openBurger">
					<v-btn fab small id="drawerBtn">
						<v-icon color="#4c5b77" v-if="openBurger" @click="clickNav('close')"
							>mdi-backburger</v-icon
						></v-btn
					>
					<div class="detailsContentCon">
						<DetailsSection
							:metaData="metaData"
							@getQuestionMetaData="getQuestionMetaData"
							:reset="reset"
						/>
					</div>
				</div>
			</v-dialog>
		</div>

		<v-overlay
			:value="overlay"
			v-if="this.$vuetify.breakpoint.width <= 1000"
		></v-overlay>

		<UpdateSection
			@getQuestionDetails="getQuestionDetails"
			@getQuestionOptions="getQuestionOptions"
			@resetComplete="resetComplete"
			:reset="reset"
			:loadingDialog="loadingDialog"
			:question_main_details="question_main_details"
		/>

		<div class="submitBtn largeShow">
			<v-btn
				style="margin: 0px 10px"
				text
				:disabled="!proceed || !has_modified"
				:dark="proceed || has_modified"
				@click="selectAuthor('update')"
				id="updateQuestionBtn"
				>Submit Update</v-btn
			>

			<v-btn
				:disabled="!proceed || !has_modified"
				:dark="!proceed || !has_modified"
				@click="selectAuthor('create')"
				id="submitQuestionBtn"
				>Create as new</v-btn
			>
		</div>

		<div class="submitBtn smallShow">
			<v-btn
				style="margin: 0px 10px"
				fab
				small
				:disabled="!proceed || !has_modified"
				:dark="!proceed || !has_modified"
				@click="selectAuthor('update')"
				id="updateQuestionBtn"
				><v-icon color="#4B5A76">mdi-content-save</v-icon></v-btn
			>

			<v-btn
				fab
				small
				:disabled="!proceed || !has_modified"
				:dark="proceed || has_modified"
				@click="selectAuthor('create')"
				id="submitQuestionBtn"
				><v-icon color="#4B5A76">mdi-new-box</v-icon></v-btn
			>
		</div>

		<Processing :loadingDialog="loadingDialog" />
		<Snackbar
			v-if="snackbar"
			:snackbar="snackbar"
			:message="message"
			:status="status"
			@closeSnackbar="closeSnackbar"
		/>
		<ConfirmDialog
			v-if="confirmSubmission"
			:mode="mode"
			:confirmSubmission="confirmSubmission"
			@cancelSubmission="cancelSubmission"
			@proceedSubmission="proceedSubmission"
		/>
	</div>
</template>

<script>
	import UpdateSection from "../../components/StaffComponents/UpdateQuestionComponents/QuestionCreation/UpdateSection.vue";
	import DetailsSection from "../../components/StaffComponents/UpdateQuestionComponents/QuestionDetails/DetailsSection.vue";
	import Processing from "../../components/GeneralModals/Processing.vue";
	import Snackbar from "../../components/GeneralModals/Snackbar.vue";
	import ConfirmDialog from "../../components/GeneralModals/Confirm.vue";
	import QuestionsAPI from "../../api/QuestionsAPI";
	import { useQuestionStore } from "../../store/QuestionStore";

	export default {
		components: {
			UpdateSection,
			DetailsSection,
			Processing,
			Snackbar,
			ConfirmDialog,
		},

		created() {
			this.question_data = JSON.parse(
				JSON.stringify(this.questionStore.chosenQuestion)
			);

			this.questionStore.updatedQuestion = Object.assign(
				{},
				this.questionStore.chosenQuestion
			);
			this.questionMetadata = this.question_data.metadata;
			this.questionDetails = Object.keys(this.question_data).reduce(
				(obj, k) => {
					if (k != "metadata") obj[k] = this.question_data[k];
					return obj;
				},
				{}
			);

			console.log(this.questionMetadata);
			console.log(this.questionDetails);
		},

		mounted() {
			if (this.$vuetify.breakpoint.width <= 1000) {
				this.clickNav("open");
			}
		},

		data: () => ({
			questionStore: useQuestionStore(),
			drawer: true,
			mini: false,
			question: {},
			questionMetadata: {},
			questionDetails: {},
			metaData: { empty: true },
			question_main_details: {},
			proceed: false,
			loadingDialog: false,
			snackbar: false,
			reset: false,
			status: "",
			message: "",
			confirmSubmission: false,
			has_modified: false,
			question_content_modified: false,
			question_image_modified: false,
			mode: false,
			user: null,
			windowHeight: window.innerHeight,
			openBurger: false,
			overlay: false,
		}),

		methods: {
			selectAuthor(mode) {
				this.confirmSubmission = true;
				this.mode = mode;
			},
			cancelSubmission() {
				this.confirmSubmission = false;
			},
			proceedSubmission() {
				this.confirmSubmission = false;
				if (this.mode == "update") {
					this.updateQuestion();
				} else if (this.mode == "create") {
					this.submitQuestion();
				}
			},

			getQuestionMetaData(metaData) {
				let question = metaData;
				this.metaData = metaData;
				question.response_type = this.question.response_type;
				question.question_content = this.question.question_content;
				question.question_img = this.question.question_img;
				question.options = this.question.options;
				this.question = question;
				this.is_proceed();
			},

			getQuestionDetails(details) {
				this.question.response_type = details.response_type;
				this.question.question_content = details.question_content;
				this.question.question_img = details.question_image;

				if (
					this.question.question_content !=
					this.questionStore.chosenQuestion.question_content
				) {
					this.question_content_modified = true;
				} else {
					this.question_content_modified = false;
				}

				if (this.question.question_img == "") {
					this.question.question_img = null;
				}

				if (
					this.question.question_img !=
					this.questionStore.chosenQuestion.question_img
				) {
					this.question_image_modified = true;
				} else {
					this.question_image_modified = false;
				}

				this.is_proceed();
			},

			getQuestionOptions(options) {
				this.question.options = options;

				this.is_proceed();
			},

			is_proceed() {
				let is_proceed = true;
				Object.entries(this.question).forEach((item) => {
					if (!item[1]) {
						if (item[0] == "question_img" || item[0] == "options") {
						} else {
							is_proceed = false;
						}
					}
				});

				if (this.question.question_type == "College Level") {
					if (this.question.test_code) {
						if (this.question.test_code.length > 6) {
							is_proceed = false;
						}
					}
				}

				if (this.question.question_type == "MathWorld") {
					if (this.question.teks_code) {
						if (this.question.teks_code.length > 6) {
							is_proceed = false;
						}
					}
					if (this.question.points) {
						if (this.question.points < 0 || this.question.points > 100) {
							is_proceed = false;
						}
					}
				}

				if (is_proceed) {
					this.checkOptions();
				} else {
					this.proceed = is_proceed;
				}

				this.checkForModifications();
			},

			checkForModifications() {
				this.has_modified = false;

				Object.entries(this.question).forEach(([key, value]) => {
					if (key in this.question_data) {
						if (key != "options") {
							if (this.questionStore.chosenQuestion[key] != value) {
								this.has_modified = true;
							}
						} else {
							if (
								JSON.stringify(value) !=
								JSON.stringify(this.questionStore.chosenQuestion[key])
							) {
								this.has_modified = true;
							}
						}
					}
				});

				if (this.question_content_modified) {
					this.has_modified = true;
				}

				if (this.question_image_modified) {
					this.has_modified = true;
				}
			},

			checkOptions() {
				let is_proceed = true;
				let has_answer = false;

				if (this.question.options) {
					Object.entries(this.question.options).forEach((item) => {
						if (!item[1].content) {
							is_proceed = false;
						}
					});
					if (this.question.response_type == "Checkboxes" && is_proceed) {
						Object.entries(this.question.options).forEach((item) => {
							if (item[1].is_answer) {
								has_answer = true;
							}
						});

						if (!has_answer) {
							is_proceed = false;
						}
					}

					if (
						this.question.response_type == "Range Open Response" &&
						is_proceed
					) {
						if (this.question.options.length < 2) {
							is_proceed = false;
						} else {
							if (
								!isNaN(Number(this.question.options[0].content)) &&
								!isNaN(Number(this.question.options[1].content))
							) {
								let num1 = parseFloat(this.question.options[0].content);
								let num2 = parseFloat(this.question.options[1].content);

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

			async submitQuestion() {
				this.loadingDialog = true;
				this.mini = true;

				this.question.id = this.question_data.id;

				try {
					const fd = await this.convertToFormData();
					let result = null;
					if (this.question.question_type == "College Level") {
						result = await QuestionsAPI.prototype.createCollegeQuestion(fd);
					} else if (this.question.question_type == "MathWorld") {
						result = await QuestionsAPI.prototype.createMathWorldQuestion(fd);
					} else if (this.question.question_type == "STAAR") {
						result = await QuestionsAPI.prototype.createStaarQuestion(fd);
					}

					this.loadingDialog = false;
					this.reset = true;
					this.mini = false;
					this.$emit("closeUpdate", {
						message: "created",
						question: this.question,
					});
				} catch (error) {
					this.loadingDialog = false;
					this.mini = false;
					this.status = "Error";
					this.message = "An Error Occured. Please try again.";
					this.snackbar = true;
				}
			},

			async updateQuestion() {
				this.loadingDialog = true;
				this.mini = true;

				this.question.id = this.question_data.id;

				try {
					const fd = await this.convertToFormData();
					let result = null;
					if (this.question.question_type == "College Level") {
						result = await QuestionsAPI.prototype.updateCollegeQuestion(
							this.question.id,
							fd
						);
					} else if (this.question.question_type == "MathWorld") {
						result = await QuestionsAPI.prototype.updateMathWorldQuestion(
							this.question.id,
							fd
						);
					} else if (this.question.question_type == "STAAR") {
						result = await QuestionsAPI.prototype.updateSTAARQuestion(
							this.question.id,
							fd
						);
					}

					this.loadingDialog = false;
					this.reset = true;
					this.mini = false;

					this.$emit("closeUpdate", {
						message: "updated",
						question: this.question,
					});
				} catch (error) {
					console.log(error);
					this.loadingDialog = false;
					this.mini = false;
					this.status = "Error";
					this.message = "An Error Occured. Please try again.";
					this.snackbar = true;
				}
			},

			async convertToFormData() {
				try {
					const fd = new FormData();
					if (this.question.question_img) {
						fd.append(
							"question_image",
							this.question.question_img,
							"question_image.jpg"
						);
						this.question.question_img = "";
					}

					for (let i = 0; i < this.question.options.length; i++) {
						if (this.question.options[i].image != "") {
							const image = await this.getBlobFromUrl(
								this.question.options[i].image
							);

							fd.append("option_images", image, `option_image${i}.jpg`);
							this.question.options[i].image = "";
						}
					}

					fd.append("data", JSON.stringify(this.question));
					return fd;
				} catch (error) {
					console.log(error);
				}
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

			closeSnackbar() {
				this.snackbar = false;
			},
			resetComplete() {
				this.reset = false;
			},

			clickNav(params) {
				if (params == "open") {
					this.openBurger = true;
					this.overlay = true;
				}

				if (params == "close") {
					this.openBurger = false;
					this.overlay = false;
				}
			},
		},

		computed: {
			getQuestionData: function () {
				if (this.question_data.question_type == "STAAR") {
					this.metaData = {
						question_type: this.question_data.question_type,
						grade_level: this.question_data.grade_level,
						release_date: this.question_data.release_date,
					};
				}

				if (this.question_data.question_type == "College Level") {
					this.metaData = {
						question_type: this.question_data.question_type,
						classification: this.question_data.classification,
						test_code: this.question_data.test_code,
					};
				}

				if (this.question_data.question_type == "MathWorld") {
					this.metaData = {
						question_type: this.question_data.question_type,
						grade_level: this.question_data.grade_level,
						teks_code: this.question_data.teks_code,
						subject: this.question_data.subject,
						topic: this.question_data.topic,
						category: this.question_data.category,
						keywords: this.question_data.keywords,
						difficulty: this.question_data.difficulty,
						points: this.question_data.points,
					};
				}

				this.question_main_details = {
					response_type: this.question_data.response_type,
					question_content: this.question_data.question_content,
					question_img: this.question_data.question_img,
					options: this.question_data.options,
				};
			},

			listenForMediaWidth: function () {
				if (this.$vuetify.breakpoint.width <= 1000) {
					this.clickNav("open");
				} else {
					this.clickNav("close");
				}
			},

			listenForChanges: function () {
				if (
					JSON.stringify(this.questionStore.updatedQuestion) !=
					JSON.stringify(this.questionStore.chosenQuestion)
				) {
					console.log("occur some changes");
				}
			},
		},
	};
</script>

<style scoped>
	.createQuestion {
		padding: 10px 0px;
		display: flex;
		color: #4c5b77;
	}

	.v-navigation-drawer__content {
		padding: 20px 10px;
		max-height: 85vh;
		min-height: 85vh;
	}

	.drawer {
		display: flex;
	}

	.drawerBtn {
		margin: 20px 0px;
		margin-left: 15px;
	}

	.submitBtn {
		z-index: 3;
		position: absolute;
		right: 20px;
		top: 5px;
		z-index: 3;
		display: flex;
		align-items: center;
		height: 50px;
	}

	.smallConView {
		display: none;
		padding: 10px 10px;

		position: absolute;

		z-index: 5;
		overflow: auto;

		left: -5px;
		margin: 0px;
		background-color: white;
	}

	.navBarCon {
		padding: 20px 10px;
		background-color: white;
		width: 375px;
		height: 100vh;
		overflow-y: auto;
		display: flex;
	}

	.smallConView .v-btn {
		margin-left: 5px;
		margin-top: 20px;
	}

	.detailsContentCon {
		margin-left: -10px;
	}

	.smallShow {
		display: none;
	}

	@media only screen and (max-width: 1000px) {
		.smallConView {
			display: flex;
		}

		.largeConView {
			display: none;
		}

		.createQuestion {
			padding: 10px 10px;
		}
	}

	@media only screen and (max-width: 600px) {
		.submitBtn {
			right: 10px;
		}

		.largeShow {
			display: none;
		}
		.smallShow {
			display: flex;
		}
	}

	@media only screen and (max-width: 540px) {
		.smallConView {
			background-color: transparent;
		}
		.smallConView .v-btn {
			height: 30px;
			width: 30px;
			margin-top: 0px;
		}
	}
</style>
