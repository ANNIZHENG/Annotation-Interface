<template>
  <v-card
    light
    flat
    tile
    style="width: 100%; background-color: #fff;"
  >
    <v-card-text>
      <h3 align="center">
        Consent Form for IRB-FY2019-2872
      </h3>

      <p>You have been invited to take part in a research study to learn more about how to elicit the true confidence of participants when making sound annotations with the goal of increasing the quality of the annotations and, in consequence, the performance of machine learning models. This study will be conducted by Ana Elisa Mendez Mendez, STEINHARDT - Music and Audio Research Laboratory (MARL), Steinhardt School of Culture, Education, and Human Development, New York University, as a part of her independent study. Her faculty sponsor is Professor Oded Nov, Deparmtent of TANDON - Technology Management and Innovation (TMI), Tandon School of Engineering, New York University.</p>

      <p>If you agree to be in this study, you will be asked to do the following:</p>

      <ul>
        <li>Listen to 20 sound recordings.</li>
        <li>Determine whether a specific sound source is present in each of the recordings or not.</li>
        <li>Select how confident you are about each of your answers</li>
      </ul>

      <p>Participation in this study will involve 20 minutes of your time: 1 minute to label each recording. There are no known risks associated with your participation in this research beyond those of everyday life. </p>

      <p>Although you will receive no direct benefits, this research may help the investigator understand how to elicit the true confidence of participants when making sound annotations with the goal of increasing the quality of the annotations and, in consequence, the performance of machine learning models. You will receive $1 for participating in the study and a bonus payment based on performance for up to ${{ reward }} for each answer for a maximum possible payment of ${{ reward_max + 1 }}.</p>

      <p>Confidentiality of your research records will be strictly maintained by not saving any personalized data on our database. Your information from this study will not be used for future research.</p>

      <p>Participation in this study is voluntary. You may refuse to participate or withdraw at any time without penalty. For interviews, questionnaires, or surveys, you have the right to skip or not answer any questions you prefer not to answer. </p>

      <p>If there is anything about the study or your participation that is unclear or that you do not understand, if you have questions or wish to report a research-related problem, you may contact Ana Elisa Mendez Mendez at (305) 904-5899, anaelisamendez@nyu.edu, 35 W 4th St, Room 245, New York, NY 10012, or the faculty sponsor, Oded Nov at (646) 997-3562, onov@nyu.edu, LC 401, 5 MetroTech Center, Brooklyn, NY 11201.</p>

      <p>For questions about your rights as a research participant, you may contact the University Committee on Activities Involving Human Subjects (UCAIHS), New York University, 665 Broadway, Suite 804, New York, New York, 10012, at ask.humansubjects@nyu.edu or (212) 998-4808. Please reference the study # (IRB-FY2019-2872) when contacting the IRB (UCAIHS).</p>
    </v-card-text>
  </v-card>
</template>

<script>
  import {mapState, mapGetters} from 'vuex'
  export default {
    name: 'ConsentForm',
    computed: {
      ...mapState(['reward']),
      ...mapGetters(['reward_max'])
    }
  }
</script>
