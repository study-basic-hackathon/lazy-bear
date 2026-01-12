"use client";
import { useParams, useRouter } from "next/navigation";
import { baseMaterialOptions, type ProjectCreateViewModel } from "@/frontend/types/viewModel/project";
import { convertProjectCreateVM } from "@/frontend/converts/project";
import { handleApiResult } from "@/frontend/utils/handleApiResult";
import { postProject } from "@/frontend/api/project";
import { useProjectForm } from "@/frontend/hooks/project/projectCreate";

export default function ProjectCreatePage() {
  const router = useRouter();
  const params = useParams<{ personaId: string }>();
  const { personaId } = params;
  const {
    form,
    errors,
    apiError,
    setErrors,
    setApiError,
    resetErrors,
    handleChange,
  } = useProjectForm()

  const handleSubmit = async () => {
    resetErrors();

    const result = convertProjectCreateVM(form);
    if (!result.success) {
      setErrors(result.error);
      return;
    }
    handleApiResult(
      await postProject(personaId, result.value),
      (id) => router.push(`/personas/${personaId}/projects/${id}/weights/new`),
      (error) => setApiError(error.message)
    );
  }

  return (
    <div className="min-h-screen min-w-screen bg-[#EBEEF1] flex justify-center">
      <div
        className="p-6 bg-white relative"
        style={{ width: "335px", height: "752px", marginTop: "30px" }}
      >
        {/* プロジェクト作成フォーム */}
        <form
          onSubmit={handleSubmit}
          className="grid"
          style={{
            width: "295px",
            height: "423px",
            rowGap: "24px",
            marginTop: "70px",
          }}
        >
          {/* フォーム入力欄（資格名, 開始日, 試験日, 学習方法） */}
          <div
            className="grid"
            style={{
              height: "100px",
              rowGap: "24px",
            }}
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                何の資格を目標にしていますか
              </label>
              <input
                type="text"
                value={form.certificationName}
                onChange={(e) => handleChange({ certificationName: e.target.value })}
                className="w-full border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.certificationName ? "#000000" : "#A8A5AF",
                }}
                placeholder="例: AWS SAA"
                required
              />
              {errors.certificationName && (
                <p className="text-red-500 text-sm mt-1">{errors.certificationName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                何日から開始しますか
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleChange({ startDate: e.target.value })}
                className="w-full border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.startDate ? "#000000" : "#A8A5AF",
                }}
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
              )}

            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                何日に試験を受けたいですか
              </label>
              <input
                type="date"
                value={form.examDate}
                onChange={(e) => handleChange({ examDate: e.target.value })}
                className="w-full border border-[#EBEEF1] p-2 placeholder-[#A8A5AF]"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: form.examDate ? "#000000" : "#A8A5AF",
                }}
              />
              {errors.examDate && (
                <p className="text-red-500 text-sm mt-1">{errors.examDate.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                メインとなる学習媒体を教えてください
              </label>
              <select
                value={form.baseMaterial}
                onChange={(e)=> handleChange({ baseMaterial: e.target.value as ProjectCreateViewModel["baseMaterial"]})}
                className="w-full border border-[#EBEEF1] p-2"
                style={{
                  borderRadius: "0px",
                  backgroundColor: "#EFF0F4",
                  color: "#A8A5AF",
                }}>
                {baseMaterialOptions.map((option) => (
                  <option key={option.label} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.baseMaterial && (
                <p className="text-red-500 text-sm mt-1">{errors.baseMaterial.message}</p>
              )}
            </div>
          </div>
          <button
            type="submit"
            className="font-semibold transition absolute left-1/2 transform -translate-x-1/2"
            style={{
              width: "226px",
              height: "60px",
              borderRadius: "0px",
              backgroundColor: "#3C436D",
              color: "#FFFFFF",
              top: "611px",
            }}
          >
            決定
          </button>
        </form>
      </div>
    </div>
  );
}
