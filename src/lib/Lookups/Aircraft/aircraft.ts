export type Aircraft = {
	name: string
	tailNumber: string
	weight: number
	moment: number
	arm: number
}

const list: Aircraft[] = [
	{ name: 'E1', tailNumber: 'N31ER', weight: 1225, arm: 32.0473, moment: 39258 },
	{ name: 'E2', tailNumber: 'N42ER', weight: 1200.04, arm: 31.25, moment: 37501.25 },
	{ name: 'R- 1', tailNumber: 'N912MA', weight: 1325.72, arm: 12.4164, moment: 16460.72 },
	{ name: 'R- 2', tailNumber: 'N602ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R- 3', tailNumber: 'N603ER', weight: 1712.4, arm: 40.8164, moment: 69894 },
	{ name: 'R- 4', tailNumber: 'N604ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R- 5', tailNumber: 'N605ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R- 6', tailNumber: 'N506ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R- 7', tailNumber: 'N507ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R- 8', tailNumber: 'N608ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R- 9', tailNumber: 'N509ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-10', tailNumber: 'N610ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-11', tailNumber: 'N511ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-12', tailNumber: 'N712ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-14', tailNumber: 'N614ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-15', tailNumber: 'N615ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-16', tailNumber: 'N516ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-17', tailNumber: 'N617ER', weight: 1713.4, arm: 41.1608, moment: 70525 },
	{ name: 'R-19', tailNumber: 'N619ER', weight: 1714.8, arm: 41.6707, moment: 71457 },
	{ name: 'R-22', tailNumber: 'N522ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-23', tailNumber: 'N236TH', weight: 1689.8, arm: 41.1339, moment: 69508 },
	{ name: 'R-25', tailNumber: 'N235TH', weight: 1690.1, arm: 41.4679, moment: 70084.9 },
	{ name: 'R-29', tailNumber: 'N629ER', weight: 1711.4, arm: 41.1704, moment: 70459 },
	{ name: 'R-32', tailNumber: 'N632ER', weight: 1686.36, arm: 40.3824, moment: 68099.23 },
	{ name: 'R-33', tailNumber: 'N633ER', weight: 1681.56, arm: 40.3506, moment: 67851.96 },
	{ name: 'R-34', tailNumber: 'N634ER', weight: 1689.73, arm: 40.9498, moment: 69194.14 },
	{ name: 'R-35', tailNumber: 'N635ER', weight: 1686.36, arm: 40.3824, moment: 68099.23 },
	{ name: 'R-36', tailNumber: 'N636ER', weight: 1683.96, arm: 40.3787, moment: 67996.13 },
	{ name: 'R-37', tailNumber: 'N637ER', weight: 1686.36, arm: 40.3824, moment: 68099.23 },
	{ name: 'R-39', tailNumber: 'N639ER', weight: 1684.73, arm: 40.5176, moment: 68261.29 },
	{ name: 'R-40', tailNumber: 'N640ER', weight: 1683.06, arm: 40.7674, moment: 68613.95 },
	{ name: 'R-41', tailNumber: 'N641ER', weight: 1683.06, arm: 40.7674, moment: 68613.95 },
	{ name: 'R-42', tailNumber: 'N542ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-43', tailNumber: 'N643ER', weight: 1683.06, arm: 40.7674, moment: 68613.95 },
	{ name: 'R-44', tailNumber: 'N644ER', weight: 1675.16, arm: 40.6866, moment: 68156.59 },
	{ name: 'R-45', tailNumber: 'N645ER', weight: 1678.26, arm: 40.7611, moment: 68407.75 },
	{ name: 'R-46', tailNumber: 'N646ER', weight: 1682.6, arm: 40.7563, moment: 68576.47 },
	{ name: 'R-47', tailNumber: 'N647ER', weight: 1680.2, arm: 40.7531, moment: 68473.37 },
	{ name: 'R-48', tailNumber: 'N648ER', weight: 1682.6, arm: 40.7563, moment: 68576.47 },
	{ name: 'R-49 SPIN', tailNumber: 'N649ER', weight: 1652.7, arm: 39.9534, moment: 66030.94 },
	{ name: 'R-52', tailNumber: 'N652ER', weight: 1680.88, arm: 40.6932, moment: 68400.37 },
	{ name: 'R-53', tailNumber: 'N653ER', weight: 1723.7, arm: 41.5826, moment: 71676 },
	{ name: 'R-54', tailNumber: 'N554ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-55', tailNumber: 'N655ER', weight: 1723.7, arm: 41.5826, moment: 71676 },
	{ name: 'R-56', tailNumber: 'N656ER', weight: 1723.7, arm: 41.5826, moment: 71676 },
	{ name: 'R-57', tailNumber: 'N657ER', weight: 1723.7, arm: 41.5826, moment: 71676 },
	{ name: 'R-58', tailNumber: 'N658ER', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'R-59', tailNumber: 'N659ER', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'R-60', tailNumber: 'N660ER', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'R-61 SPIN', tailNumber: 'N661ER', weight: 1679.5875, arm: 40.7339, moment: 68416.12 },
	{ name: 'R-62', tailNumber: 'N662ER', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'R-64', tailNumber: 'N664ER', weight: 1708.4, arm: 41.437, moment: 70791 },
	{ name: 'R-65', tailNumber: 'N565ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-66', tailNumber: 'N566ER', weight: 1714.7, arm: 41.3367, moment: 70880 },
	{ name: 'R-67', tailNumber: 'N667ER', weight: 1708.4, arm: 41.437, moment: 70791 },
	{ name: 'R-68', tailNumber: 'N668ER', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'R-69', tailNumber: 'N669ER', weight: 1706.4, arm: 41.4762, moment: 70775 },
	{ name: 'R-70', tailNumber: 'N670ER', weight: 1720.4, arm: 41.0654, moment: 70649 },
	{ name: 'R-71', tailNumber: 'N671ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-72', tailNumber: 'N672ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-73', tailNumber: 'N673ER', weight: 1714.8, arm: 41.6707, moment: 71457 },
	{ name: 'R-74', tailNumber: 'N674ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-75', tailNumber: 'N675ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-76', tailNumber: 'N676ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-79', tailNumber: 'N679ER', weight: 1707.7, arm: 41.071, moment: 70137 },
	{ name: 'R-82', tailNumber: 'N4944S', weight: 1881.28, arm: 38.1025, moment: 71681.5 },
	{ name: 'R-90', tailNumber: 'N790ER', weight: 3259.53, arm: 95.47, moment: 311187.33 },
	{ name: 'R-91', tailNumber: 'N791ER', weight: 3251.818, arm: 95.47, moment: 310451.06 },
	{ name: 'R-92', tailNumber: 'N792ER', weight: 3248.5, arm: 95.47, moment: 310134.3 },
	{ name: 'R-96', tailNumber: 'N596ER', weight: 3269.8179, arm: 95.437, moment: 312061.61 },
	{ name: 'R-97', tailNumber: 'N597ER', weight: 3269.82, arm: 95.5965, moment: 312583.43 },
	{ name: 'R-98', tailNumber: 'N598ER', weight: 3249.98, arm: 95.3612, moment: 309921.96 },
	{ name: 'R-99', tailNumber: 'N599ER', weight: 3274.23, arm: 95.5572, moment: 312876.17 }
]

export async function lookupAircraft(name: string): Promise<Aircraft | null> {
	let out = null
	list.forEach((plane) => {
		if (plane.name == name) out = plane
	})
	return out
}
