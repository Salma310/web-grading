<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="space-y-5 sm:space-y-6">
        <div class="flex justify-end mb-4">
            <Button
                variant="primary"
                :endIcon="PlusIcon"
                @click="() => router.push('/batch/add')"
            >
                Tambah Batch
            </Button>
        </div>
              <ComponentCard title="Data Batch">

        <div
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="max-w-full overflow-x-auto">
            <table class="min-w-full">

              <!-- HEADER -->
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left">Lot Code</th>
                  <th class="px-5 py-3 text-left">Petani</th>
                  <th class="px-5 py-3 text-left">Lahan</th>
                  <th class="px-5 py-3 text-left">Total Buah</th>
                  <th class="px-5 py-3 text-left">Status</th>
                  <th class="px-5 py-3 text-left">Action</th>
                </tr>
              </thead>

              <!-- BODY -->
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="batch in batches"
                  :key="batch.id"
                  class="border-t"
                >
                  <td class="px-5 py-4">
                    {{ batch.lot_code }}
                  </td>

                  <td class="px-5 py-4">
                    {{ batch.farmer?.name }}
                  </td>

                  <td class="px-5 py-4">
                    {{ batch.land?.location }}
                  </td>

                  <td class="px-5 py-4">
                    {{ batch.total_fruits || 0 }}
                  </td>

                  <td class="px-5 py-4">
                    <span
                      :class="[
                        'px-2 py-1 rounded text-xs font-medium',
                        batch.status === 'OPEN'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-gray-200 text-gray-600'
                      ]"
                    >
                      {{ batch.status }}
                    </span>
                  </td>

                  <td class="px-5 py-4 space-x-2">
                    <button
                      @click="goDetail(batch.id)"
                      class="text-blue-500"
                    >
                      Detail
                    </button>

                    <button
                      v-if="batch.status === 'OPEN'"
                      @click="handleClose(batch.id)"
                      class="text-red-500"
                    >
                      Close
                    </button>
                  </td>
                </tr>

                <tr v-if="batches.length === 0">
                  <td colspan="6" class="text-center p-5 text-gray-500">
                    Tidak ada data batch
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>

      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { useRouter } from "vue-router";
import Button from "@/components/ui/Button.vue";
import PlusIcon from "@/icons/PlusIcon.vue";

import {
  getBatches,
  closeBatch
} from "@/services/batchService";

const currentPageTitle = ref("Data Batch");

const batches = ref([]);    
const router = useRouter();


const goAdd = () => {
  router.push("/batch/add");
};

// fetch data
const fetchData = async () => {
  try {
    const res = await getBatches();
    batches.value = res.data;
  } catch (err) {
    console.error(err);
  }
};

// close batch
const handleClose = async (id) => {
  try {
    await closeBatch(id);
    fetchData();
  } catch (err) {
    console.error(err);
  }
};

// detail page
const goDetail = (id) => {
  window.location.href = `/batch/${id}`;
};

onMounted(fetchData);
</script>