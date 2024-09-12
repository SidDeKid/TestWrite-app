<script lang="ts" setup>
import { companyInfoHelper } from "@/helpers/companyInfoHelper";
</script>


<template>
  <div class="notFound page">
    <section>
      <div class="content">
        <h1>404 Pagina niet gevonden</h1>
      </div>
    </section>
    <section>
      <div class="content">
        <h2>Waar was je naar opzoek?</h2>
        <p>
          Mail het naar {{ companyInfoHelper.standardEmail }} a.u.b. Wij zouden het graag willen weten.
        </p>
      </div>
    </section>
  </div>
</template>