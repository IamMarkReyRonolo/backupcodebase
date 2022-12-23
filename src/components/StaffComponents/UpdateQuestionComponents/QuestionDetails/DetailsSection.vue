<template>
	<div class="questionDetails">
		<br />
		<h1>Question Metadata</h1>
		<br />
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

		<StaarType
			v-if="questionMetaData.question_type == 'STAAR'"
			:questionMetaData="questionMetaData"
			@updateMetaData="updateMetaData"
		/>
		<CollegeType
			v-if="questionMetaData.question_type == 'College Level'"
			:questionMetaData="questionMetaData"
			@updateMetaData="updateMetaData"
		/>
		<MathworldType
			v-if="questionMetaData.question_type == 'MathWorld'"
			:questionMetaData="questionMetaData"
			@updateMetaData="updateMetaData"
		/>

		<div v-if="questionMetaData.question_type == 'MathWorld'">
			<div class="field">
				<div class="fieldLabel">Difficulty *</div>
				<div class="select">
					<v-select
						filled
						dense
						v-model="questionMetaData.difficulty"
						:items="difficulty"
						:rules="required"
						id="setDifficulty"
					></v-select>

					<div class="details selectDetails">Set the level of difficulty</div>
				</div>
			</div>
			<div class="field">
				<div class="fieldLabel">Points *</div>
				<div class="select">
					<v-text-field
						filled
						dense
						v-model="questionMetaData.points"
						type="number"
						:rules="requiredInteger"
						id="setPoints"
					></v-text-field>
					<div class="details selectDetails">
						Set points for this question (1 - 100).
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import StaarType from "./StaarType.vue";
	import MathworldType from "./MathworldType.vue";
	import CollegeType from "./CollegeType.vue";
	export default {
		components: { StaarType, CollegeType, MathworldType },
		props: {
			metaData: Object,
			reset: Boolean,
		},
		created() {
			if (!this.metaData.empty) {
				this.questionMetaData = this.metaData;
				this.qType.forEach((qt) => {
					if (qt.name == this.questionMetaData.question_type) {
						qt.selected = true;
						this.qDetails = qt.details;
					} else {
						qt.selected = false;
					}
				});
			}
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
			question: {},
			questionMetaData: {
				question_type: "STAAR",
				difficulty: "",
				points: null,
			},
			difficulty: ["Easy", "Average", "Hard", "Advance"],
			required: [(v) => !!v || "Required"],
			requiredInteger: [
				(v) => !!v || "Required Integer",
				(v) => (v > 0 && v <= 100) || "Invalid amount",
			],
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

			updateMetaData(metaData) {
				if (metaData.question_type == "STAAR") {
					this.questionMetaData = {
						question_type: metaData.question_type,
						grade_level: metaData.grade_level,
						release_date: metaData.release_date,
					};
				}

				if (metaData.question_type == "College Level") {
					this.questionMetaData = {
						question_type: metaData.question_type,
						classification: metaData.classification,
						test_code: metaData.test_code,
					};
				}

				if (metaData.question_type == "MathWorld") {
					this.questionMetaData = {
						question_type: metaData.question_type,
						grade_level: metaData.grade_level,
						teks_code: metaData.teks_code,
						subject: metaData.subject,
						topic: metaData.topic,
						category: metaData.category,
						keywords: metaData.keywords,
						difficulty: this.questionMetaData.difficulty,
						points: this.questionMetaData.points,
					};
				}

				this.$emit("getQuestionMetaData", this.questionMetaData);
			},
		},

		computed: {
			resetDetails: function () {
				if (this.reset) {
					this.questionMetaData = {
						question_type: "STAAR",
						difficulty: "",
						points: null,
					};
					this.$emit("getQuestionMetaData", this.questionMetaData);
				}
			},
		},
	};
</script>

<style>
	.questionDetails {
		overflow-y: auto;
		padding: 0px 20px;
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
