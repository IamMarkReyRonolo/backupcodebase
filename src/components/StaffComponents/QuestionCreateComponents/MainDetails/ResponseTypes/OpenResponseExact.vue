<template>
	<div class="openResponseExactDiv">
		<div class="optionField">
			<div class="optionWrapper1">
				<div class="fieldLabel largeView">
					Answer - Alt + Enter to add equation *
				</div>

				<div class="fieldLabel smallView">Answer</div>
				<div class="optionContent">
					<div class="option">
						<v-textarea
							filled
							auto-grow
							rows="1"
							row-height="20"
							@keydown.enter.alt.exact.prevent="doSomething('1')"
							ref="textarea"
							v-model="questionStore.createQuestion.options[0].content"
							:rules="required"
							id="inputOption-OpenResponseField"
						></v-textarea>
						<v-btn
							small
							class="smallView"
							@click="doSomething('1')"
							id="addEquationBtn-OpenResponseField"
							>Add Equation</v-btn
						>
					</div>
				</div>
			</div>

			<br />

			<div class="optionWrapper2">
				<div class="fieldLabel largeView">
					Unit - Alt + Enter to add equation
				</div>

				<div class="fieldLabel smallView">Unit</div>

				<div class="optionContent unit">
					<div class="option">
						<v-textarea
							filled
							auto-grow
							rows="1"
							row-height="20"
							@keydown.enter.alt.exact.prevent="doSomething('2')"
							ref="textAreaUnit"
							v-model="questionStore.createQuestion.options[0].unit"
							id="inputOption-UnitField"
							hint="not required"
							persistent-hint
						></v-textarea>
						<v-btn
							small
							class="smallView"
							@click="doSomething('2')"
							id="addEquationBtn-Unit"
							>Add Equation</v-btn
						>
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
	import AddEquationModal from ".././addEquation/AddEquationModal";
	import { useQuestionStore } from "../../../../../store/QuestionStore";
	export default {
		components: {
			AddEquationModal,
		},

		created() {
			this.questionStore.createQuestion.options = [
				this.questionStore.createQuestion.options[0],
			];
			this.questionStore.createQuestion.options[0].letter = "A";
			this.questionStore.createQuestion.options[0].is_answer = true;
			this.questionStore.createQuestion.options[0].image = "";
		},
		data: () => ({
			questionStore: useQuestionStore(),
			dialog: false,
			insertText: "",
			required: [(v) => !!v || "Required"],
			number: "",
		}),
		methods: {
			doSomething(number) {
				this.dialog = true;
				this.number = number;
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
				let textarea = null;
				if (this.number == "1") {
					textarea = this.$refs.textarea.$refs.input;
				} else {
					textarea = this.$refs.textAreaUnit.$refs.input;
				}

				const sentence = textarea.value;
				const len = sentence.length;
				let pos = textarea.selectionStart;
				if (pos === undefined) {
					pos = 0;
				}

				const before = sentence.substr(0, pos);
				const after = sentence.substr(pos, len);

				if (this.number == "1") {
					this.questionStore.createQuestion.options[0].content =
						before + insertText + after;
				} else {
					this.questionStore.createQuestion.options[0].unit =
						before + insertText + after;
				}

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
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
		display: flex;
	}

	.optionWrapper1 {
		width: 60%;
		margin-right: 20px;
	}

	.optionContent {
		width: 100%;
		display: flex;
		justify-content: flex-start;
		align-items: flex-start;
	}

	.option {
		width: 100%;
	}

	.smallView {
		display: none;
	}

	.unit {
		width: 200px;
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
	@media only screen and (max-width: 750px) {
		.largeView {
			display: none;
		}

		.smallView {
			display: block;
		}
	}

	@media only screen and (max-width: 540px) {
		.fieldLabel {
			font-size: 12px;
		}

		.optionWrapper1 {
			width: 100%;
		}

		.option {
			width: 100%;
		}

		.optionField {
			margin-bottom: -5px;
			display: block;
		}
	}
</style>
