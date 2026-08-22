import {
    MODE_OPTIONS,
    STEPS,
    SURFACE_OPTIONS,
    SURFACE_SPECIALISTS,
    type SurfaceType,
} from "@/features/missions/data/fixtures/wizardMockData";

export class WizardRepository {
    private static mockSteps = [...STEPS];
    private static mockSurfaceOptions = [...SURFACE_OPTIONS];
    private static mockModeOptions = [...MODE_OPTIONS];
    private static mockSurfaceSpecialists = { ...SURFACE_SPECIALISTS };

    async fetchAll<U>(options?: {
        page?: number;
        limit?: number;
        collection?: string;
    }): Promise<U[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const { page = 1, limit = 50, collection } = options ?? {};
                const start = (page - 1) * limit;

                let data: unknown[] = [];
                switch (collection) {
                    case "surfaceOptions":
                        data = WizardRepository.mockSurfaceOptions;
                        break;
                    case "modeOptions":
                        data = WizardRepository.mockModeOptions;
                        break;
                    case "surfaceSpecialists":
                        // Since this is a record and not an array, we wrap it in an array to fit fetchAll signature,
                        // or we can fetch it via a specific static method. Let's return it as a single-element array.
                        data = [WizardRepository.mockSurfaceSpecialists];
                        break;
                    case undefined:
                    default:
                        data = WizardRepository.mockSteps;
                        break;
                }

                resolve(data.slice(start, start + limit) as unknown as U[]);
            }, 100);
        });
    }

    static async getSteps() {
        const repo = new WizardRepository();
        return repo.fetchAll<(typeof STEPS)[0]>({ limit: 1000, collection: "steps" });
    }

    static async getSurfaceOptions() {
        const repo = new WizardRepository();
        return repo.fetchAll<(typeof SURFACE_OPTIONS)[0]>({
            limit: 1000,
            collection: "surfaceOptions",
        });
    }

    static async getModeOptions() {
        const repo = new WizardRepository();
        return repo.fetchAll<(typeof MODE_OPTIONS)[0]>({ limit: 1000, collection: "modeOptions" });
    }

    static async getSurfaceSpecialists() {
        // Not using fetchAll for this as it's a Record.
        return new Promise<Record<SurfaceType, string[]>>((resolve) => {
            setTimeout(() => {
                resolve(WizardRepository.mockSurfaceSpecialists);
            }, 100);
        });
    }
}
