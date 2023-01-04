<template>
	<div>
		<div class="field">
			<div class="fieldLabel">Grade Level *</div>
			<div class="select">
				<div class="levels">
					<v-btn
						color="#4C5B77"
						dark
						width="40"
						:text="!glevel.selected"
						@click="select(glevel)"
						v-for="(glevel, index) in gradeLevels"
						:key="index"
						class="gradeLevel"
						:id="'selectGrade' + glevel.level"
						><span class="vtext">{{ glevel.level }}</span></v-btn
					>
				</div>

				<div class="details">Associate grade level to this question</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Input TEKS *</div>
			<div class="select">
				<v-text-field
					filled
					dense
					v-model="questionStore.createQuestion.metadata.teks_code"
					:rules="teksCodeRules"
					counter="6"
					id="setTeksCode"
				></v-text-field>
				<div class="details selectDetails">
					Texas Essential Knowledge and Skills
				</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Select Subject *</div>
			<div class="select">
				<v-combobox
					v-model="questionStore.createQuestion.metadata.subject"
					:items="subjects"
					filled
					dense
					color="#4c5b77"
					:rules="required"
					id="setSubject"
				></v-combobox>
				<div class="details selectDetails">
					Select subject or create a new one.
				</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Select Topic *</div>
			<div class="select">
				<v-combobox
					v-model="questionStore.createQuestion.metadata.topic"
					:items="topics"
					filled
					dense
					color="#4c5b77"
					:rules="required"
					id="setTopic"
				></v-combobox>
				<div class="details selectDetails">
					Select topic or create a new one.
				</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Select Category *</div>
			<div class="select">
				<v-combobox
					v-model="questionStore.createQuestion.metadata.category"
					:items="categories"
					filled
					dense
					color="#4c5b77"
					:rules="required"
					id="setCategory"
				></v-combobox>
				<div class="details selectDetails">
					Select categopry or create a new one.
				</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Tags/Keywords *</div>
			<div class="select">
				<v-combobox
					v-model="questionStore.createQuestion.metadata.keywords"
					:items="keywords"
					multiple
					filled
					dense
					small-chips
					:rules="keywordsRule"
					id="setKeywords"
				></v-combobox>

				<div class="details selectDetails">Press enter to add tag/keyword.</div>
			</div>
		</div>

		<div class="field">
			<div class="fieldLabel">Difficulty *</div>
			<div class="select">
				<v-select
					filled
					dense
					v-model="questionStore.createQuestion.metadata.difficulty"
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
					v-model="questionStore.createQuestion.metadata.points"
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
</template>

<script>
	import { useQuestionStore } from "../../../../../store/QuestionStore";
	export default {
		created() {
			let hasSelected = false;
			this.gradeLevels.forEach((level) => {
				if (
					level.level == this.questionStore.createQuestion.metadata.grade_level
				) {
					level.selected = true;
					hasSelected = true;
				} else {
					level.selected = false;
				}
			});

			if (!hasSelected) {
				this.gradeLevels[0].selected = true;
				this.questionStore.createQuestion.metadata.grade_level =
					this.gradeLevels[0].level;
			}
		},
		data: () => ({
			questionStore: useQuestionStore(),
			gradeLevels: [
				{ level: 3, selected: true },
				{ level: 4, selected: false },
				{ level: 5, selected: false },
				{ level: 6, selected: false },
				{ level: 7, selected: false },
				{ level: 8, selected: false },
				{ level: 9, selected: false },
				{ level: 10, selected: false },
				{ level: 11, selected: false },
				{ level: 12, selected: false },
			],
			subjects: ["Algebra", "Pre Calculus", "Basic Calculus"],
			topics: [],
			categories: [],
			keywords: [],
			difficulty: ["Easy", "Average", "Hard", "Advance"],
			required: [(v) => !!v || "Required"],
			teksCodeRules: [
				(v) =>
					v ? v.length <= 6 || "Exceeded number of characters" : true || "",
				(v) => !!v || "Required",
			],
			keywordsRule: [(v) => v.length > 0 || "Required"],
			requiredInteger: [
				(v) => !!v || "Required Integer",
				(v) => (v > 0 && v <= 100) || "Invalid amount",
			],
		}),

		methods: {
			select(gLevel) {
				this.gradeLevels.forEach((l) => {
					if (l.level == gLevel.level) {
						l.selected = true;
						this.questionStore.createQuestion.metadata.grade_level = l.level;
					} else {
						l.selected = false;
					}
				});
			},
		},
	};
</script>

<style scoped>
	.select {
		width: 95%;
	}

	.levels {
		display: flex;
		flex-wrap: wrap;
	}
	.gradeLevel {
		margin-right: 2px;
	}

	.selectDetails {
		margin-top: -20px;
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
</style>
