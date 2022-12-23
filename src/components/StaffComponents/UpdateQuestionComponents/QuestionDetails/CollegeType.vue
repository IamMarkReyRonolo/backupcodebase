<template>
	<div>
		{{ updateMetaData }}
		<div class="field">
			<div class="fieldLabel">Classification *</div>
			<div class="select">
				<v-btn
					color="#4C5B77"
					dark
					:text="!type.selected"
					@click="select(type)"
					width="150"
					v-for="(type, index) in typeOfQ"
					:key="index"
					block
					:id="'select' + type.name"
					><span class="vtext">{{ type.name }}</span></v-btn
				>
				<div class="details" id="classificationSelectedDetails">
					{{ tqDetails }}
				</div>
			</div>
		</div>
		<div class="field">
			<div class="fieldLabel">Test Code *</div>
			<v-text-field
				filled
				dense
				v-model="metaData.test_code"
				:rules="required"
				counter="6"
				id="setTestCode"
			></v-text-field>
			<div class="details selectDetails">
				Associate this question to a test via code.
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			questionMetaData: Object,
		},
		created() {
			this.metaData = this.questionMetaData;
			let hasSelected = false;
			this.typeOfQ.forEach((tq) => {
				if (tq.name == this.metaData.classification) {
					tq.selected = true;
					this.tqDetails = tq.details;
					hasSelected = true;
				} else {
					tq.selected = false;
				}
			});

			if (!hasSelected) {
				this.typeOfQ[0].selected = true;
				this.metaData.classification = this.typeOfQ[0].name;
				this.tqDetails = this.typeOfQ[0].details;
			}
		},
		data: () => ({
			typeOfQ: [
				{ name: "SAT", selected: true, details: "Scholastic Aptitude Test" },
				{ name: "ACT", selected: false, details: "American College Testing" },
				{ name: "TSI", selected: false, details: "Texas Success Initiative" },
			],
			tqDetails: "Scholastic Aptitude Test",
			metaData: {},
			required: [
				(v) => !!v || "Required",
				(v) =>
					v ? v.length <= 6 || "Exceeded number of characters" : true || "",
			],
		}),

		methods: {
			select(type) {
				this.typeOfQ.forEach((l) => {
					if (l.name == type.name) {
						l.selected = true;
						this.metaData.classification = type.name;
						this.$emit("updateMetaData", this.metaData);
						this.tqDetails = l.details;
					} else {
						l.selected = false;
					}
				});
			},
		},

		computed: {
			updateMetaData: function () {
				this.$emit("updateMetaData", this.metaData);
			},
		},
	};
</script>

<style scoped>
	.select {
		width: 95%;
	}

	.select {
		display: flex;
		flex-wrap: wrap;
	}

	.selectDetails {
		margin-top: -20px;
	}
</style>
