<template>
	<div class="checkBoxDiv">
		{{ listenForAnswer }}
		<div class="optionField">
			<div class="fieldLabel">
				Options: Select to declare the answer *. {{ selected }}
			</div>

			<div class="fieldLabel smallView">Alt + Enter to add equation</div>

			<div
				class="choice"
				v-for="(choice, index) in questionStore.updatedQuestion.options"
				:key="index"
			>
				<v-checkbox
					v-model="selected"
					:value="choice.letter"
					:id="'selectLetter' + choice.letter"
				></v-checkbox>

				<div class="optionContent">
					<div class="option">
						<v-textarea
							filled
							auto-grow
							rows="1"
							row-height="20"
							@keydown.enter.alt.exact.prevent="doSomething(index)"
							ref="textarea"
							v-model="choice.content"
							:rules="required"
							:id="'inputOption-Checkbox-Letter' + choice.letter"
						></v-textarea>
						<v-btn small class="showEquationBtn" @click="doSomething(index)"
							>Add Equation</v-btn
						>
					</div>
				</div>

				<!-- <div class="addChoiceImg">
					<div class="imgPresent">
						<img
							:src="choice.image"
							alt=""
							height="100"
							v-if="choice.image != ''"
						/>
						<div style="text-align: center">
							<div
								@click="addFile(index)"
								:class="
									choice.image == '' ? 'addImage' : 'addImage changeImage'
								"
								:id="'addImage-Option' + choice.letter"
							>
								<div>
									<v-icon color="#5a6882" v-if="choice.image == ''"
										>mdi-image</v-icon
									>
								</div>
								<div>
									<span v-if="choice.image == ''" class="smallView"
										>Add Image</span
									><span v-if="choice.image != ''">Change Image</span>
								</div>
							</div>
						</div>
					</div>

					<input
						type="file"
						accept="image/*"
						ref="fileInputChoices"
						style="display: none"
						@change="imageFile"
					/>
				</div> -->

				<div class="addImgCon">
					<div class="imgPresent">
						<div class="imgContainer" v-if="choice.image != ''">
							<img :src="choice.image" alt="" v-if="choice.image != ''" />
						</div>

						<div style="text-align: center">
							<div
								@click="addFile(index)"
								v-if="choice.image == ''"
								class="addImage"
								id="addQuestionImage"
							>
								<div>
									<v-icon color="#5a6882" v-if="choice.image == ''"
										>mdi-image</v-icon
									>
								</div>
							</div>

							<div class="moreControlBtns" v-if="choice.image != ''">
								<v-btn
									fab
									x-small
									class="primary imageControlBtns"
									@click="addFile(index)"
									><v-icon size="15">mdi-pencil</v-icon></v-btn
								>
								<v-btn
									fab
									x-small
									class="error imageControlBtns"
									@click="choice.image = ''"
									><v-icon size="15">mdi-close</v-icon></v-btn
								>
							</div>
						</div>
					</div>

					<input
						type="file"
						accept="image/*"
						ref="fileInputChoices"
						style="display: none"
						@change="imageFile"
					/>
				</div>

				<v-btn
					fab
					x-small
					color="error"
					@click="deleteMultipleChoiceOption(index)"
					:disabled="questionStore.updatedQuestion.options.length == 1"
					:id="'deleteBtn-Option' + choice.letter"
					><v-icon>mdi-delete</v-icon></v-btn
				>
			</div>

			<div class="addAnotherCon">
				<v-btn
					outlined
					small
					@click="addMultipleChoiceOption"
					id="addAnotherOptionBtn"
					>Add Another Option</v-btn
				>
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
	import AddEquationModal from ".././addEquation/AddEquationModal";
	import { useQuestionStore } from "../../../../../store/QuestionStore";
	export default {
		components: {
			AddEquationModal,
		},

		async created() {
			// for (let i = 0; i < this.questionStore.updatedQuestion.options.length; i++) {
			// 	if (this.multipleChoices[i].image != "") {
			// 		let image = await fetch(this.multipleChoices[i].image).then((r) =>
			// 			r.blob()
			// 		);
			// 		const reader = new FileReader();
			// 		reader.readAsDataURL(image);
			// 		reader.onloadend = () => {
			// 			this.multipleChoices[i].image = reader.result;
			// 		};
			// 	}
			// }

			if (this.questionStore.updatedQuestion.options.length < 2) {
				this.questionStore.updatedQuestion.options.push({
					letter: "B",
					content: "",
					image: "",
					is_answer: false,
				});
				this.questionStore.updatedQuestion.options[0].letter = "A";
				this.questionStore.updatedQuestion.options[0].unit = "";
				this.questionStore.updatedQuestion.options[1].unit = "";
			}

			this.questionStore.updatedQuestion.options.forEach((choice) => {
				if (choice.is_answer) {
					this.selected.push(choice.letter);
				}
			});
		},
		data: () => ({
			questionStore: useQuestionStore(),
			dialog: false,
			insertText: "",
			indexLoc: -1,
			selected: [],
			required: [(v) => !!v || "Required"],
		}),
		methods: {
			addMultipleChoiceOption() {
				const option = {
					letter: String.fromCharCode(
						65 + this.questionStore.updatedQuestion.options.length
					),
					content: "",
					image: "",
					is_answer: false,
				};

				this.questionStore.updatedQuestion.options.push(option);
			},

			deleteMultipleChoiceOption(index) {
				this.questionStore.updatedQuestion.options.splice(index, 1);
				let start = 65;
				this.questionStore.updatedQuestion.options.forEach((choice) => {
					choice.letter = String.fromCharCode(start++);
				});
			},

			imageFile(file) {
				if (file && this.indexLoc != -1) {
					let files = file.target.files;
					if (files.length == 0) {
						this.questionStore.updatedQuestion.options[this.indexLoc].image =
							"";
					} else {
						let fileName = files[0].name;
						const reader = new FileReader();
						reader.readAsDataURL(files[0]);
						reader.onloadend = () => {
							this.questionStore.updatedQuestion.options[this.indexLoc].image =
								reader.result;
						};
					}
				}
			},

			addFile(index) {
				this.indexLoc = index;
				this.$refs.fileInputChoices[index].click();
			},

			doSomething(index) {
				this.indexLoc = index;
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

				const textarea = this.$refs.textarea[this.indexLoc].$refs.input;
				const sentence = textarea.value;
				const len = sentence.length;
				let pos = textarea.selectionStart;
				if (pos === undefined) {
					pos = 0;
				}

				const before = sentence.substr(0, pos);
				const after = sentence.substr(pos, len);

				this.questionStore.updatedQuestion.options[this.indexLoc].content =
					before + insertText + after;

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
				});
			},
		},

		computed: {
			listenForAnswer: function () {
				this.questionStore.updatedQuestion.options.forEach((choice) => {
					if (this.selected.includes(choice.letter)) {
						choice.is_answer = true;
					} else {
						choice.is_answer = false;
					}
				});
			},
		},
	};
</script>

<style scoped>
	.questionCreation {
		padding: 20px;
		min-width: 60%;
		width: 100%;
	}

	.optionField {
		margin-bottom: -5px;
	}

	.optionContent {
		width: 100%;
		display: flex;

		padding-top: 20px;
	}

	.option {
		width: 100%;
	}

	.choice {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.addChoiceImg {
		width: 20%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-bottom: 10px;
		margin-top: 0px;
	}

	.addImgCon {
		width: 20%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
	}

	.addImage {
		cursor: pointer;
		padding: 10px;
		border-radius: 10px;
		color: #4b5a76;
		background-color: #f5f5f5;
		font-weight: 500;
		width: 70px;
		height: 70px;
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
			0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		transition-duration: 0.28s;
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		margin-top: -10px;
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
		padding: 5px 10px;
	}

	img {
		width: 80px;
		height: 80px;
	}

	.addAnotherCon {
		padding: 0px 40px;
	}

	.showEquationBtn {
		display: none;
		margin-top: -20px;
		margin-bottom: 30px;
	}

	.field {
		color: #4c5b77;
		padding: 20px;
	}

	.fieldLabel {
		padding-bottom: 20px;
		font-weight: bold;
		font-size: 14px;
		color: #4c5b77;
	}

	@media only screen and (max-width: 1200px) {
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
			width: 60px;
			height: 60px;
		}

		.imgContainer {
			padding: 10px;
		}

		.addImage {
			padding: 10px;
			border-radius: 5px;
			font-size: 12px;
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
	}

	@media only screen and (max-width: 750px) {
		.smallView {
			display: none;
		}

		.showEquationBtn {
			display: block;
		}

		.addImage {
			width: 50px;
			height: 50px;
			margin-top: -50px;
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
			width: 60px;
			height: 60px;
		}

		.imgContainer {
			padding: 5px;
			margin-top: 0px;
		}
	}

	@media only screen and (max-width: 540px) {
		.fieldLabel {
			font-size: 12px;
		}

		.addImage {
			padding: 10px 20px;
			border-radius: 5px;
			font-size: 24px;
			width: 40px;
			height: 40px;
			margin-top: -45px;
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
			width: 40px;
			height: 40px;
		}

		.imgContainer {
			padding: 10px;
			margin-top: 0px;
		}
	}
</style>
