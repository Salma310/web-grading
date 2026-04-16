<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div
      class="min-h-screen rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12"
    >
      <div class="mb-6">
        <h3 class="text-xl font-semibold text-gray-800 dark:text-white">
          Data Grading Jambu
        </h3>
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <table class="w-full border border-gray-200 rounded-lg">
          <thead class="bg-gray-100 dark:bg-gray-800">
            <tr>
              <th class="p-3 text-left">No</th>
              <th class="p-3 text-left">Gambar</th>
              <th class="p-3 text-left">Grade</th>
              <th class="p-3 text-left">Berat</th>
              <th class="p-3 text-left">Tanggal</th>
            </tr>
          </thead>

          <tbody>
            <tr
              v-for="(item, index) in gradings"
              :key="item._id"
              class="border-t"
            >
              <td class="p-3">{{ index + 1 }}</td>

              <td class="p-3">
                <img
                  :src="item.imageUrl"
                  class="w-16 h-16 object-cover rounded"
                />
              </td>

              <td class="p-3 font-semibold">
                <span
                  :class="{
                    'text-green-600': item.grade === 'A',
                    'text-yellow-600': item.grade === 'B',
                    'text-red-600': item.grade === 'C'
                  }"
                >
                  {{ item.grade }}
                </span>
              </td>

              <td class="p-3">{{ item.berat }} g</td>

              <td class="p-3">
                {{ formatDate(item.createdAt) }}
              </td>
            </tr>

            <tr v-if="gradings.length === 0">
              <td colspan="5" class="text-center p-5 text-gray-500">
                Tidak ada data
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { getGradings } from "@/services/gradingService.js";

const currentPageTitle = ref("Data Grading");

const gradings = ref([]);

const fetchData = async () => {
  try {
    gradings.value = await getGradings();
  } catch (err) {
    console.error(err);
  }
};

const formatDate = (date) => {
  return new Date(date).toLocaleString();
};

onMounted(() => {
  fetchData();
});
</script>