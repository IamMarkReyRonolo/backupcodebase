<template>
	<div class="questionCreation">
		<div v-if="fetched">
			{{ getQuestionDetails }}
			{{ resetDetails }}

			<v-expansion-panels focusable>
				<v-expansion-panel>
					<v-expansion-panel-header>Question Preview</v-expansion-panel-header>

					<v-expansion-panel-content>
						<div class="field">
							<div class="noPreview" id="noPreview" v-if="!question">
								No Preview
							</div>
							<div class="preview" v-if="question" id="hasPreview">
								<div class="fieldLabel">Question:</div>
								<div>
									<vue-mathjax
										:formula="question + ' '"
										v-if="count % 2 == 0"
									></vue-mathjax>
									<vue-mathjax
										:formula="question"
										v-if="count % 2 != 0"
									></vue-mathjax>
									<div style="margin: 10px auto; width: 200px">
										<img :src="img" alt="" width="200" v-if="img != ''" />
									</div>
								</div>
								<br />
								<br />

								<div
									class="fieldLabel"
									v-if="
										selectedResponse == 'Open Response Exact' ||
										selectedResponse == 'Range Open Response'
									"
								>
									Answer:
								</div>
								<div
									class="fieldLabel"
									v-if="
										selectedResponse == 'Multiple Choice' ||
										selectedResponse == 'Checkboxes'
									"
								>
									Options:
								</div>

								<div
									class="answerCon"
									v-for="(value, index) in options"
									:key="index"
								>
									<div
										v-if="
											selectedResponse == 'Multiple Choice' ||
											selectedResponse == 'Checkboxes'
										"
									>
										<div>
											<div>
												<span style="font-weight: bold"
													>{{ value.letter }}.</span
												>

												<vue-mathjax
													:formula="value.content + ' '"
													v-if="value.content && count % 2 == 0"
													style="margin: 0px 15px"
												></vue-mathjax>
												<vue-mathjax
													:formula="value.content"
													v-if="value.content && count % 2 != 0"
													style="margin: 0px 15px"
												></vue-mathjax>

												<span v-if="!value.content" style="margin: 0px 15px"
													>No Content</span
												>
												<span
													v-if="value.is_answer"
													style="font-weight: bold; font-size: 14px"
													>Correct Answer</span
												>
											</div>
										</div>
										<div style="margin: 20px">
											<img
												:src="value.image"
												alt=""
												width="200"
												v-if="value.image != ''"
											/>
										</div>
									</div>
									<div>
										<div v-if="selectedResponse == 'Open Response Exact'">
											<vue-mathjax
												:formula="value.content + ' '"
												v-if="value.content && count % 2 == 0"
												style="margin: 0px 15px"
											></vue-mathjax>
											<vue-mathjax
												:formula="value.content"
												v-if="value.content && count % 2 != 0"
												style="margin: 0px 15px"
											></vue-mathjax>
											<span v-if="!value.content" style="margin: 0px 15px"
												>No Content</span
											>
											<vue-mathjax
												:formula="value.unit"
												v-if="value.unit"
												style="margin: 0px 15px"
											></vue-mathjax>
										</div>
										<div v-if="selectedResponse == 'Range Open Response'">
											<span style="font-weight: bold" v-if="index == 0"
												>Min:
											</span>
											<span style="font-weight: bold" v-if="index == 1"
												>Max:
											</span>
											<vue-mathjax
												:formula="value.content + ' '"
												v-if="value.content && count % 2 == 0"
												style="margin: 0px 15px"
											></vue-mathjax>
											<vue-mathjax
												:formula="value.content"
												v-if="value.content && count % 2 != 0"
												style="margin: 0px 15px"
											></vue-mathjax>
											<vue-mathjax
												:formula="value.unit"
												v-if="value.unit"
												style="margin: 0px 15px"
											></vue-mathjax>
											<span v-if="!value.content" style="margin: 0px 15px"
												>No Content</span
											>
										</div>
									</div>
								</div>
							</div>

							<br />
						</div>
					</v-expansion-panel-content>
				</v-expansion-panel>
			</v-expansion-panels>
			<br />

			<div class="field questionField">
				<div class="fieldLabel">Response Type *</div>
				<div class="selectType">
					<v-select
						:items="responseTypes"
						v-model="selectedResponse"
						filled
						dense
						@change="count++"
						id="selectResponseType"
					></v-select>
				</div>
			</div>

			<div class="questionContainer questionField">
				<div class="fieldLabel smallView">
					Question - Alt + Enter to add equation *
				</div>

				<div class="fieldLabel showQuestionLabel">Question</div>

				<div class="questionContent" v-if="!reset">
					<div class="question">
						<v-textarea
							filled
							auto-grow
							rows="4"
							row-height="20"
							@keydown.enter.alt.exact.prevent="doSomething"
							ref="textarea"
							v-model="question"
							:rules="required"
							id="inputQuestionField"
						></v-textarea>

						<v-btn small class="showEquationBtn" @click="doSomething"
							>Add Equation</v-btn
						>
					</div>

					<div class="addImgCon">
						<div class="imgPresent">
							<img :src="img" alt="" v-if="img != ''" />
							<div style="text-align: center" class="addImageBtn">
								<!-- <v-btn
								@click="addFile('question', 0)"
								:x-small="img != ''"
								:x-large="img == ''"
								style="margin-top: -20px"
								id="addQuestionImage"
								><v-icon>mdi-image</v-icon>
								<span v-if="img == ''">Add Image</span
								><span v-if="img != ''">Change Image</span></v-btn
							> -->

								<div
									@click="addFile('question', 0)"
									:class="img == '' ? 'addImage' : 'addImage changeImage'"
									id="addQuestionImage"
								>
									<div>
										<v-icon color="#5a6882" v-if="img == ''">mdi-image</v-icon>
									</div>
									<div>
										<span v-if="img == ''" class="smallView">Add Image</span
										><span v-if="img != ''">Change Image</span>
									</div>
								</div>
							</div>
						</div>

						<input
							type="file"
							accept="image/*"
							ref="fileInput"
							style="display: none"
							@change="imageFile"
						/>
					</div>
				</div>
			</div>

			<div v-if="!reset">
				<OpenResponseExact
					v-if="selectedResponse == 'Open Response Exact'"
					:options="options"
					@updateOptions="updateOptions"
				/>
				<OpenResponseRange
					v-if="selectedResponse == 'Range Open Response'"
					:options="options"
					@updateOptions="updateOptions"
				/>
				<MultipleChoice
					v-if="selectedResponse == 'Multiple Choice'"
					:options="options"
					@updateOptions="updateOptions"
				/>
				<Checkboxes
					v-if="selectedResponse == 'Checkboxes'"
					:options="options"
					@updateOptions="updateOptions"
				/>
			</div>

			<AddEquationModal
				:dialog="dialog"
				@cancelDialog="cancelDialog"
				@addEquation="addEquation"
			/>
		</div>

		<div class="loading" v-if="loading">
			<v-progress-circular :size="80" color="#4B5A76" indeterminate>
				<span style="font-size: 12px">Loading</span></v-progress-circular
			>
		</div>
		<div class="error" v-if="error">error</div>
	</div>
</template>

<script>
	import { VueMathjax } from "vue-mathjax";
	import AddEquationModal from "../AddEquationModal.vue";
	import OpenResponseExact from "./OpenResponseExact.vue";
	import OpenResponseRange from "./OpenResponseRange.vue";
	import MultipleChoice from "./MultipleChoice.vue";
	import Checkboxes from "./Checkboxes.vue";
	export default {
		components: {
			AddEquationModal,
			"vue-mathjax": VueMathjax,
			OpenResponseExact,
			OpenResponseRange,
			MultipleChoice,
			Checkboxes,
		},

		props: {
			reset: Boolean,
			loadingDialog: Boolean,
			question_main_details: Object,
		},
		async created() {
			try {
				this.loading = true;
				this.fetched = false;
				this.selectedResponse = this.question_main_details.response_type;
				this.question = this.question_main_details.question_content;

				if (this.question_main_details.question_img) {
					this.img = this.question_main_details.question_img;
					this.question_image = await fetch(
						this.question_main_details.question_img
					).then((r) => r.blob());
				}

				this.options = this.question_main_details.options;
				this.loading = false;
				this.fetched = true;
			} catch (error) {
				this.loading = false;
				this.fetched = false;
				this.error = true;
			}
		},
		data() {
			return {
				dialog: false,
				insertText: "",
				responseTypes: [
					"Open Response Exact",
					"Range Open Response",
					"Multiple Choice",
					"Checkboxes",
				],
				selectedResponse: "Open Response Exact",
				question: "",
				img: "",
				options: [
					{
						letter: "A",
						content: "",
						image: "",
						is_answer: true,
					},
				],
				questionDetails: {},
				count: 0,
				required: [(v) => !!v || "Required"],
				enableEquation: false,
				fetched: false,
				loading: false,
				error: false,
			};
		},
		methods: {
			updateOptions(options) {
				this.options = options;
				this.$emit("getQuestionOptions", options);
			},
			doSomething() {
				this.dialog = true;
			},

			cancelDialog() {
				this.dialog = false;
			},

			addEquation(equation) {
				this.insertText = equation;
				this.dialog = false;
				this.execInsertText();
			},

			execInsertText() {
				const insertText = "$" + this.insertText + "$";
				if (!insertText.length) return;

				const textarea = this.$refs.textarea.$refs.input;
				const sentence = textarea.value;
				const len = sentence.length;
				let pos = textarea.selectionStart;
				if (pos === undefined) {
					pos = 0;
				}

				const before = sentence.substr(0, pos);
				const after = sentence.substr(pos, len);

				this.question = before + insertText + after;

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
				});
			},

			imageFile(file) {
				let files = file.target.files;

				if (files.length == 0) {
					this.img = "";
				} else {
					let fileName = files[0].name;
					this.question_image = files[0];
					const reader = new FileReader();
					reader.readAsDataURL(files[0]);
					reader.onloadend = () => {
						this.img = reader.result;
					};
				}
			},
			addFile(type, index) {
				if (type == "question") {
					this.$refs.fileInput.click();
				} else {
					this.indexLoc = index;
					this.$refs.fileInputChoices[index].click();
				}
			},
		},

		computed: {
			getQuestionDetails: function () {
				this.questionDetails.response_type = this.selectedResponse;
				this.questionDetails.question_content = this.question;
				this.questionDetails.question_image = this.question_image;
				this.$emit("getQuestionDetails", this.questionDetails);
			},

			resetDetails: function () {
				if (this.reset) {
					this.selectedResponse = "Open Response Exact";
					this.question = "";
					this.img = "";
					this.question_image = null;
					this.options = [
						{
							letter: "A",
							content: "",
							image: "",
							is_answer: true,
						},
					];
					this.questionDetails = {};
					this.$emit("resetComplete");
				}
			},
		},
	};
</script>

<style scoped>
	.questionCreation {
		padding: 20px;
		min-width: 60%;
		width: 100%;
		overflow-y: auto;
		max-height: 85vh;
	}

	.questionField {
		width: 350px;
		margin-bottom: -5px;
	}

	.questionContainer {
		width: 100%;
	}

	.questionContent {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.question {
		width: 80%;
	}

	.addImgCon {
		width: 20%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.addImage {
		cursor: pointer;
		padding: 20px;
		border-radius: 10px;
		color: #4b5a76;
		background-color: #f5f5f5;
		font-weight: 500;
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
			0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		transition-duration: 0.28s;
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	.changeImage {
		font-size: 12px;
		display: flex;
		justify-content: center;
		align-items: center;
		padding: 5px 10px;
		margin: 5px 0px;
		border-radius: 2px;
	}

	.imgPresent {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.preview {
		padding: 10px;
		min-height: 70px;
		color: #5a6882;
	}

	.smallButton {
		display: none;
	}

	.showEquationBtn {
		display: none;
		margin-top: -20px;
		margin-bottom: 30px;
	}

	.showQuestionLabel {
		display: none;
	}

	img {
		width: 100px;
	}

	.loading {
		text-align: center;
		margin: 200px 0px;
	}

	@media only screen and (max-width: 1200px) {
		/* .addImgCon {
			width: 15%;
			display: flex;
			justify-content: center;
			align-items: flex-start;
		} */

		.submitBtnCon .smallView {
			padding: 5px 0px !important;
			font-size: 10px !important;
		}

		.submitBtnCon {
			display: flex;
			align-items: flex-end;
			justify-content: flex-start;
			flex-direction: column-reverse;
		}

		img {
			width: 100px;
		}
		.addImage {
			padding: 10px;
			border-radius: 5px;
			font-size: 12px;
			margin-top: 10px;
		}

		.changeImage {
			font-size: 10px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 5px;
			margin: 5px 0px;
			border-radius: 2px;
		}
	}

	@media only screen and (max-width: 1000px) {
		.questionCreation {
			padding: 20px 50px;
		}
	}

	@media only screen and (max-width: 750px) {
		.questionCreation {
			padding: 30px 50px;
		}

		.headerSecCon h1 {
			font-size: 24px;
		}
		.showQuestionLabel {
			display: block;
		}

		.showEquationBtn {
			display: block;
		}

		.submitBtnCon .v-btn {
			font-size: 12px;
			height: 32px;
			padding: 0 10px;
		}

		.smallView {
			display: none;
		}

		.addImage {
			padding: 10px;
			border-radius: 5px;
			font-size: 16px;
			margin-top: 15px;
		}

		.changeImage {
			font-size: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 4px;
			margin: 5px 0px;
			border-radius: 2px;
		}

		img {
			width: 75px;
		}
	}

	@media only screen and (max-width: 540px) {
		.questionCreation {
			padding: 50px 10px;
		}
		.submitBtnCon .v-btn {
			display: none;
		}

		.questionField {
			width: 100%;
		}

		.questionContent {
			justify-content: center;
			align-items: center;
			flex-direction: column-reverse;
		}

		.question {
			width: 100%;
		}

		.question .showEquationBtn {
			text-align: center;

			margin: auto;
			margin-top: -15px;
			margin-bottom: 35px;
		}

		.addImage {
			padding: 10px 20px;
			border-radius: 5px;
			font-size: 24px;
			margin-bottom: 20px;
			margin-top: -20px;
		}

		.changeImage {
			font-size: 12px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 4px;
			margin: 5px 0px;
			border-radius: 2px;
			margin-bottom: 20px;
		}

		img {
			width: 120px;
		}

		.smallButton {
			display: block;
			margin: 0px auto;
			margin-top: 40px;
			text-align: center;
		}

		.fieldLabel {
			font-size: 12px;
		}
	}
</style>
