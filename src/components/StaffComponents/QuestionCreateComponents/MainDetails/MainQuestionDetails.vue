<template>
	<div class="mainDetailsCon">
		<div>
			<div class="field questionField">
				<div class="fieldLabel">Response Type *</div>
				<div class="selectType">
					<v-select
						:items="responseTypes"
						v-model="questionStore.createQuestion.response_type"
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
							v-model="questionStore.createQuestion.question_content"
							:rules="required"
							id="inputQuestionField"
						></v-textarea>

						<v-btn small class="showEquationBtn" @click="doSomething"
							>Add Equation</v-btn
						>
					</div>

					<div class="addImgCon">
						<div class="imgPresent">
							<div
								class="imgContainer"
								v-if="questionStore.createQuestion.question_img != ''"
							>
								<img
									:src="questionStore.createQuestion.question_img"
									alt=""
									v-if="questionStore.createQuestion.question_img != ''"
								/>
							</div>

							<div style="text-align: center">
								<div
									@click="addFile('question', 0)"
									v-if="questionStore.createQuestion.question_img == ''"
									class="addImage"
									id="addQuestionImage"
								>
									<div>
										<v-icon
											color="#5a6882"
											v-if="questionStore.createQuestion.question_img == ''"
											>mdi-image</v-icon
										>
									</div>
								</div>

								<div
									class="moreControlBtns"
									v-if="questionStore.createQuestion.question_img != ''"
								>
									<v-btn
										fab
										x-small
										class="primary imageControlBtns"
										@click="addFile('question', 0)"
										><v-icon>mdi-pencil</v-icon></v-btn
									>
									<v-btn
										fab
										x-small
										class="error imageControlBtns"
										@click="questionStore.createQuestion.question_img = ''"
										><v-icon>mdi-close</v-icon></v-btn
									>
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
		</div>

		<AddEquationModal
			:dialog="dialog"
			@cancelDialog="cancelDialog"
			@addEquation="addEquation"
		/>
	</div>
</template>

<script>
	import { VueMathjax } from "vue-mathjax";
	import { useQuestionStore } from "../../../../store/QuestionStore";
	import AddEquationModal from "./addEquation/AddEquationModal.vue";
	export default {
		components: {
			AddEquationModal,
			"vue-mathjax": VueMathjax,
		},

		async created() {},
		data: () => ({
			questionStore: useQuestionStore(),
			question_image: "",
			dialog: false,
			insertText: "",
			responseTypes: [
				"Open Response Exact",
				"Range Open Response",
				"Multiple Choice",
				"Checkboxes",
			],
			img: "",
			count: 0,
			required: [(v) => !!v || "Required"],
			reset: false,
		}),
		methods: {
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

				this.questionStore.createQuestion.question_content =
					before + insertText + after;

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
				});
			},

			imageFile(file) {
				let files = file.target.files;

				if (files.length == 0) {
				} else {
					let fileName = files[0].name;
					const reader = new FileReader();
					reader.readAsDataURL(files[0]);
					reader.onloadend = () => {
						this.img = reader.result;
						this.questionStore.createQuestion.question_img = reader.result;
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
	};
</script>

<style scoped>
	.mainDetailsCon {
		padding: 40px 0px;
	}

	.field {
		margin-bottom: 20px;
		color: #4c5b77;
	}

	.fieldLabel {
		padding-bottom: 20px;
		font-weight: bold;
		font-size: 14px;
		color: #4c5b77;
	}

	.details {
		font-size: 14px;
		padding: 10px 0px;
	}

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
		width: 80px;
		height: 80px;
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
			0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		transition-duration: 0.28s;
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: 5px;
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

	.imgContainer {
		border-radius: 10px;
		padding: 10px;
		margin-top: -50px;
		border-radius: 10px;
		color: #4b5a76;
		background-color: #f5f5f5;
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
			0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		transition-duration: 0.28s;
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
	}

	.moreControlBtns {
		display: flex;
		justify-content: space-around;
		align-items: center;
		width: 100px;
		padding: 10px;
	}

	img {
		width: 120px;
		height: 120px;
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
			width: 90px;
			height: 90px;
		}

		.imgContainer {
			padding: 10px;
			margin-top: -30px;
		}

		.addImage {
			padding: 10px;
			border-radius: 5px;
			font-size: 12px;
			margin-top: 5px;
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
			padding: 20px;
			padding-left: 70px;
		}
	}

	@media only screen and (max-width: 750px) {
		.questionCreation {
			padding: 30px;
			padding-left: 70px;
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
			width: 70px;
			height: 70px;
			margin-top: 10px;
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
			width: 70px;
			height: 70px;
		}

		.imgContainer {
			padding: 5px;
			margin-top: 0px;
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
			height: 120px;
		}

		.imgContainer {
			padding: 10px;
			margin-top: 0px;
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
