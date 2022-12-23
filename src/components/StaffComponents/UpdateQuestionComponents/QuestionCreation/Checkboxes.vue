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
				v-for="(choice, index) in multipleChoices"
				:key="index"
			>
				<v-checkbox
					v-model="selected"
					:value="choice.letter"
					@click="updateProp"
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
							@keyup="updateProp"
							:rules="required"
							:id="'inputOption-Checkbox-Letter' + choice.letter"
						></v-textarea>
						<v-btn small class="showEquationBtn" @click="doSomething(index)"
							>Add Equation</v-btn
						>
					</div>
				</div>

				<div class="addChoiceImg">
					<div class="imgPresent">
						<img
							:src="choice.image"
							alt=""
							height="100"
							v-if="choice.image != ''"
						/>
						<div style="text-align: center">
							<!-- <v-btn
								@click="addFile(index)"
								:x-small="choice.image == '' ? false : true"
								style="margin-top: -10px"
								:id="'addImage-Option' + choice.letter"
								><v-icon>mdi-image</v-icon>
								<span v-if="choice.image == ''">Add Image</span
								><span v-if="choice.image != ''">Change Image</span></v-btn
							> -->

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
				</div>

				<v-btn
					fab
					x-small
					color="error"
					@click="deleteMultipleChoiceOption(index)"
					:disabled="multipleChoices.length == 1"
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
	import AddEquationModal from "../AddEquationModal.vue";
	export default {
		components: {
			AddEquationModal,
		},
		props: {
			options: Array,
		},
		
		async created() {
			this.multipleChoices = this.options.slice();

			for (let i = 0; i < this.multipleChoices.length; i++) {
				if (this.multipleChoices[i].image != "") {
				
					let image = await fetch(this.multipleChoices[i].image).then((r) =>
						r.blob()
					);
					const reader = new FileReader();
					reader.readAsDataURL(image);
					reader.onloadend = () => {
						this.multipleChoices[i].image = reader.result;
					};
				}
			}

			if (this.multipleChoices.length < 2) {
				this.multipleChoices.push({
					letter: "B",
					content: "",
					image: "",
					is_answer: false,
				});
			}

			this.multipleChoices[0].unit = "";
			this.multipleChoices[1].unit = "";
			this.$emit("updateOptions", this.multipleChoices);
		},
		data: () => ({
			dialog: false,
			insertText: "",
			multipleChoices: [],
			indexLoc: -1,
			selected: ["A"],
			required: [(v) => !!v || "Required"],
		}),
		methods: {
			updateProp() {
				for (let i = 0; i < this.options.length; i++) {
					console.log(this.options[i]);
					console.log(this.options[i].id);
					this.multipleChoices[i].id = this.options[i].id;
					this.multipleChoices[i].question_id = this.options[0].question_id;
				}
				this.$emit("updateOptions", this.multipleChoices);
			},
			addMultipleChoiceOption() {
				const option = {
					letter: String.fromCharCode(65 + this.multipleChoices.length),
					content: "",
					image: "",
					is_answer: false,
				};

				this.multipleChoices.push(option);
				this.updateProp();
			},

			deleteMultipleChoiceOption(index) {
				this.multipleChoices.splice(index, 1);
				let start = 65;
				this.multipleChoices.forEach((choice) => {
					choice.letter = String.fromCharCode(start++);
				});
			},

			imageFile(file) {
				if (file && this.indexLoc != -1) {
					let files = file.target.files;
					if (files.length == 0) {
						this.multipleChoices[this.indexLoc].image = "";
					} else {
						let fileName = files[0].name;
						const reader = new FileReader();
						reader.readAsDataURL(files[0]);
						reader.onloadend = () => {
							this.multipleChoices[this.indexLoc].image = reader.result;
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

				this.multipleChoices[this.indexLoc].content =
					before + insertText + after;

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
				});
			},
		},

		computed: {
			listenForAnswer: function () {
				this.multipleChoices.forEach((choice) => {
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
		margin-top: -25px;
	}

	.addChoiceImg {
		width: 20%;
		display: flex;
		justify-content: center;
		align-items: flex-start;
		padding-bottom: 10px;
		margin-top: 20px;
	}

	.imgPresent {
		display: flex;
		justify-content: center;
		flex-direction: column;
		align-items: center;
	}

	.addImage {
		cursor: pointer;
		padding: 5px 10px;
		font-size: 12px;
		border-radius: 5px;
		color: #4b5a76;
		background-color: #f5f5f5;
		font-weight: 500;
		box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
			0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
		transition-duration: 0.28s;
		transition-property: box-shadow, transform, opacity;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		margin-top: -20px;
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

	.addAnotherCon {
		padding: 0px 40px;
	}

	.showEquationBtn {
		display: none;
		margin-top: -20px;
		margin-bottom: 30px;
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
			width: 100px;
		}
		.addImage {
			padding: 5px 10px;
			border-radius: 5px;
			font-size: 10px;
			margin-top: -20px;
		}

		.changeImage {
			font-size: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 5px;
			margin: 0px 0px;
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
			padding: 10px;
			border-radius: 5px;
			font-size: 16px;
			margin-top: -20px;
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
		.fieldLabel {
			font-size: 12px;
		}

		.addImage {
			padding: 8px;
			border-radius: 5px;
			font-size: 12px;
			margin-top: -20px;
			border-radius: 5px;
			color: #4b5a76;
			background-color: transparent;
			font-weight: 500;
			box-shadow: none;
			transition-duration: 0.28s;
			transition-property: none;
			transition-timing-function: none;
		}

		.changeImage {
			font-size: 8px;
			display: flex;
			justify-content: center;
			align-items: center;
			padding: 0px;
			margin: 5px 0px;
			border-radius: 2px;
		}

		img {
			width: 60px;
			height: 60px;
		}
	}
</style>
