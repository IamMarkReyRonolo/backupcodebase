<template>
	<div class="openResponseRangeDiv">
		<div class="optionField">
			<div class="fieldLabel largeView">
				Answer - Alt + Enter to add equation *
			</div>
			<div class="fieldLabel smallView">Answer</div>

			<div class="optionContent">
				<div class="option">
					<div class="fieldLabel">Min *</div>
					<v-text-field
						filled
						auto-grow
						rows="1"
						row-height="20"
						ref="textarea1"
						v-model="multipleChoices[0].content"
						@keyup="updateProp"
						:rules="[lessThanRule]"
						type="number"
						id="inputOption-minFieldRange"
					></v-text-field>
				</div>

				<div class="separator">-</div>

				<div class="option">
					<div class="fieldLabel">Max *</div>
					<v-text-field
						filled
						auto-grow
						rows="1"
						row-height="20"
						ref="textarea2"
						v-model="multipleChoices[1].content"
						@keyup="updateProp"
						:rules="[greaterThanRule]"
						type="number"
						id="inputOption-maxFieldRange"
					></v-text-field>
				</div>
			</div>
		</div>

		<div class="optionWrapper2">
			<div class="fieldLabel largeView">Unit - Alt + Enter to add equation</div>

			<div class="fieldLabel smallView">Unit</div>

			<div class="optionContent unit">
				<div class="option">
					<v-textarea
						filled
						auto-grow
						rows="1"
						row-height="20"
						@keydown.enter.alt.exact.prevent="doSomething"
						ref="textareaUnit"
						@keyup="updateProp"
						v-model="multipleChoices[0].unit"
						id="inputOption-UnitField"
						hint="not required"
						persistent-hint
					></v-textarea>
					<v-btn
						small
						class="smallView"
						@click="doSomething"
						id="addEquationBtn-Unit"
						>Add Equation</v-btn
					>
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
	import AddEquationModal from "../AddEquationModal.vue";
	export default {
		components: {
			AddEquationModal,
		},
		props: {
			options: Array,
		},
		created() {
			this.multipleChoices = this.options;
			if (this.multipleChoices.length < 2) {
				this.multipleChoices.push({
					letter: "B",
					content: "",
					image: "",
					unit: "",
					is_answer: true,
				});
			}
			this.multipleChoices[0].is_answer = true;
			this.multipleChoices[1].is_answer = true;
			this.multipleChoices[0].image = "";
			this.multipleChoices[1].image = "";
			if (!!isNaN(Number(this.multipleChoices[0].content))) {
				this.multipleChoices[0].content = "";
			}

			if (!!isNaN(Number(this.multipleChoices[1].content))) {
				this.multipleChoices[1].content = "";
			}
			this.$emit("updateOptions", this.multipleChoices);
		},
		data: () => ({
			option: "",
			dialog: false,
			insertText: "",
			textAreaNumber: 0,
			multipleChoices: [],
			rules: [(v) => !!v || "Required Numeric"],
		}),
		methods: {
			updateProp() {
				this.multipleChoices[1].unit = this.multipleChoices[0].unit;
				this.$emit("updateOptions", this.multipleChoices);
			},
			doSomething(number) {
				this.dialog = true;
				this.textAreaNumber = number;
			},

			cancelDialog() {
				this.dialog = false;
			},

			addEquation(equation) {
				this.insertText = equation;
				this.dialog = false;
				this.execInsertText();
			},

			// execInsertText() {
			// 	const insertText = "$" + this.insertText + "$";
			// 	if (!insertText.length) return;
			// 	let textarea = null;
			// 	if (this.textAreaNumber == "1") {
			// 		textarea = this.$refs.textarea1.$refs.input;
			// 	} else {
			// 		textarea = this.$refs.textarea2.$refs.input;
			// 	}

			// 	const sentence = textarea.value;
			// 	const len = sentence.length;
			// 	let pos = textarea.selectionStart;
			// 	if (pos === undefined) {
			// 		pos = 0;
			// 	}

			// 	const before = sentence.substr(0, pos);
			// 	const after = sentence.substr(pos, len);

			// 	if (this.textAreaNumber == "1") {
			// 		this.multipleChoices[0].content = before + insertText + after;
			// 	} else {
			// 		this.multipleChoices[1].content = before + insertText + after;
			// 	}

			// 	this.$nextTick().then(() => {
			// 		textarea.selectionStart = pos + insertText.length;
			// 	});
			// },

			execInsertText() {
				const insertText = "$" + this.insertText + "$";
				if (!insertText.length) return;

				const textarea = this.$refs.textareaUnit.$refs.input;
				const sentence = textarea.value;
				const len = sentence.length;
				let pos = textarea.selectionStart;
				if (pos === undefined) {
					pos = 0;
				}

				const before = sentence.substr(0, pos);
				const after = sentence.substr(pos, len);

				this.multipleChoices[0].unit = before + insertText + after;
				this.multipleChoices[1].unit = before + insertText + after;

				this.$nextTick().then(() => {
					textarea.selectionStart = pos + insertText.length;
				});
			},
		},

		computed: {
			lessThanRule: function () {
				try {
					let result;
					if (this.multipleChoices[0].content) {
						let num1 = parseFloat(this.multipleChoices[0].content);
						let num2 = parseFloat(this.multipleChoices[1].content);
						result = num1 >= num2 ? "Should be less than the max" : true;
					} else {
						result = "Required Numeric";
					}
					return result;
				} catch (error) {
					return true;
				}
			},
			greaterThanRule: function () {
				try {
					let result;
					if (this.multipleChoices[1].content) {
						let num1 = parseFloat(this.multipleChoices[0].content);
						let num2 = parseFloat(this.multipleChoices[1].content);
						result = num1 >= num2 ? "Should be greater than the min" : true;
					} else {
						result = "Required Numeric";
					}
					return result;
				} catch (error) {
					return true;
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
	}

	.optionField {
		margin-bottom: -5px;
	}

	.optionContent {
		width: 100%;
		display: flex;
		align-items: center;
	}

	.option {
		width: 25%;
	}

	.separator {
		font-size: 30px;
		margin: 20px;
		padding-bottom: 20px;
	}

	.smallView {
		display: none;
	}
	@media only screen and (max-width: 750px) {
		.largeView {
			display: none;
		}

		.smallView {
			display: block;
		}

		.option {
			width: 50%;
		}
	}

	@media only screen and (max-width: 540px) {
		.fieldLabel {
			font-size: 12px;
		}
	}
</style>
