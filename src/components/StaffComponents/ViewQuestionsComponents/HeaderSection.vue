<template>
	<div class="headerSection">
		<h1 style="font-weight: 500">View Questions</h1>
		<div class="typeSelectionDiv">
			<div class="btnCon largeView" v-for="(type, index) in qType" :key="index">
				<v-btn
					color="#4C5B77"
					dark
					:text="!type.selected"
					@click="select(type)"
					width="150"
					block
					:id="type.name + 'Btn'"
					><span class="vtext">{{ type.name }}</span></v-btn
				>
			</div>

			<div class="fieldLabel smallView" style="margin-bottom: -20px">
				Select Question Type
			</div>
			<v-select
				class="smallView smallFields"
				:items="qTypeSelect"
				filled
				v-model="selectedType"
				dense
				id="selectQTypeBtn"
			></v-select>
		</div>
		<div class="wrapperDiv">
			<div class="responseSelectionDiv">
				<div class="fieldLabel smallView" style="margin-bottom: -20px">
					Select Response Type
				</div>

				<v-radio-group
					v-model="selectedResponse"
					row
					hide-details="auto"
					dense
					class="largeView"
				>
					<v-radio
						color="#4c5b77"
						:label="value"
						:value="value"
						:id="value + 'Btn'"
						v-for="(value, index) in responseTypes"
						:key="index"
					></v-radio>
				</v-radio-group>

				<v-select
					class="smallView smallFields"
					:items="responseTypes"
					filled
					v-model="selectedResponse"
					dense
					id="selectResponseTypeBtn"
				></v-select>
			</div>
		</div>
	</div>
</template>

<script>
	import { useQuestionStore } from "../../../store/QuestionStore";
	export default {
		data: () => ({
			questionStore: useQuestionStore(),
			qType: [
				{ name: "All", selected: true, details: "All Types" },
				{
					name: "STAAR",
					selected: false,
					details: "State of Texas Assessments of Academic Readiness",
				},
				{
					name: "College Level",
					selected: false,
					details: "Questions in SAT, ACT, TSI, etc.",
				},
				{
					name: "MathWorld",
					selected: false,
					details: "MathWorld custom questions.",
				},
			],
			qTypeSelect: ["All", "STAAR", "College Level", "MathWorld"],
			selectedType: "All",
			qDetails: "All Types",
			responseTypes: [
				"All",
				"Open Response Exact",
				"Range Open Response",
				"Multiple Choice",
				"Checkboxes",
			],
			selectedResponse: "All",
			searchContent: "",
		}),
		watch: {
			selectedType() {
				this.qType.forEach((t) => {
					if (this.selectedType == t.name) {
						t.selected = true;

						this.qDetails = t.details;
					} else {
						t.selected = false;
					}
				});
				const filters = {
					question_type: this.selectedType,
					response_type: this.selectedResponse,
				};
				this.questionStore.filterQuestions(filters);
			},
			selectedResponse() {
				const filters = {
					question_type: this.selectedType,
					response_type: this.selectedResponse,
				};

				this.questionStore.filterQuestions(filters);
			},
		},
		methods: {
			select(type) {
				this.qType.forEach((t) => {
					if (type.name == t.name) {
						t.selected = true;
						this.selectedType = t.name;
						this.qDetails = t.details;
					} else {
						t.selected = false;
					}
				});
			},
		},
	};
</script>

<style scoped>
	.headerSection {
		color: #4c5b77;
		padding: 20px 40px;
	}

	.typeSelectionDiv {
		display: flex;
		padding: 20px 0px;
		flex-wrap: wrap;
	}

	.wrapperDiv {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
	}

	.smallView {
		margin-top: 20px;
		display: none;
		width: 100%;
	}

	/* .searchDiv {
		width: 300px;
	} */

	/* @media only screen and (max-width: 700px) {
		.typeSelectionDiv {
			display: block;
			padding: 0px;
		}

		.wrapperDiv {
			display: block;
		}

		.largeView {
			display: none;
		}

		.smallView {
			display: block;
		}
	} */

	@media only screen and (max-width: 650px) {
		.headerSection {
			padding: 20px 20px;
			padding-bottom: 0px;
		}

		.fieldLabel {
			font-size: 12px;
			padding: 5px 0px;
			margin: 5px 0px;
		}

		.typeSelectionDiv {
			display: block;
			padding: 0px;
		}

		.wrapperDiv {
			display: block;
		}

		.largeView {
			display: none;
		}

		.smallView {
			display: block;
		}
	}
</style>
