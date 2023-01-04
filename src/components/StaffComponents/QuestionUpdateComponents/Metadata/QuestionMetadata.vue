<template>
	<div class="questionDetails">
		<h1>Question Metadata</h1>
		<div class="field">
			<div class="fieldLabel">Question Type *</div>
			<div class="selectType" v-for="(type, index) in qType" :key="index">
				<v-btn
					color="#4C5B77"
					dark
					v-if="type.selected"
					@click="select(type)"
					width="150"
					block
					:id="'select' + type.name.split(' ')[0] + 'Btn'"
					><span class="vtext">{{ type.name }}</span></v-btn
				>
				<div class="details" id="selectedTypeDetails" v-if="type.selected">
					{{ qDetails }}
				</div>
			</div>
		</div>

		<StaarType v-if="questionStore.updatedQuestion.question_type == 'STAAR'" />
		<CollegeType
			v-if="questionStore.updatedQuestion.question_type == 'College Level'"
		/>
		<MathworldType
			v-if="questionStore.updatedQuestion.question_type == 'MathWorld'"
		/>
	</div>
</template>

<script>
	import StaarType from "./QuestionTypes/StaarType.vue";
	import MathworldType from "./QuestionTypes/MathworldType.vue";
	import CollegeType from "./QuestionTypes/CollegeType.vue";
	import { useQuestionStore } from "../../../../store/QuestionStore";
	export default {
		components: { StaarType, CollegeType, MathworldType },
		created() {
			this.qType.forEach((qt) => {
				if (qt.name == this.questionStore.updatedQuestion.question_type) {
					qt.selected = true;
					this.qDetails = qt.details;
				} else {
					qt.selected = false;
				}
			});
		},
		data: () => ({
			config: {
				smartMode: true,
				virtualKeyboardMode: "manual",
			},
			qType: [
				{
					name: "STAAR",
					selected: true,
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
			qDetails: "State of Texas Assessments of Academic Readiness",
			questionStore: useQuestionStore(),
		}),
		methods: {
			select(type) {
				this.qType.forEach((t) => {
					if (type.name == t.name) {
						t.selected = true;
						this.questionMetaData.question_type = t.name;
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
	.questionDetails {
		overflow-y: auto;
		padding: 0px 20px;
	}

	.questionDetails h1 {
		color: #4c5b77;
		padding: 25px 0px;
	}

	.field {
		margin-bottom: 20px;
		color: #4c5b77;
	}

	.fieldLabel {
		padding-bottom: 20px;
		font-weight: bold;
		font-size: 14px;
	}

	.details {
		font-size: 14px;
		padding: 10px 0px;
	}

	.selectDetails {
		margin-top: -20px;
	}

	@media only screen and (max-width: 1002px) {
		.questionDetails h1 {
			color: #4c5b77;
			font-size: 24px;
			padding: 10px 0px;
		}
	}
</style>
