import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const CodeView = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background p-4 md:p-8 font-mono">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="outline" onClick={() => navigate("/")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Visualizer
                    </Button>
                    <h1 className="text-2xl font-bold">Radix Sort Implementation</h1>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Pseudocode Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                    >
                        <div className="bg-muted px-4 py-3 border-b border-border">
                            <h2 className="font-semibold text-sm">Pseudocode</h2>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre className="text-sm text-black leading-relaxed">
                                {`RADIX_SORT(A):
    maxVal = maximum element in A
    exp = 1   // 1, 10, 100, ...

    while maxVal / exp > 0:
        COUNTING_SORT_BY_DIGIT(A, exp)
        exp = exp * 10

COUNTING_SORT_BY_DIGIT(A, exp):
    n = size of A
    output[0..n-1]
    count[0..9] = all zeros

    // count digits
    for i = 0 to n-1:
        digit = (A[i] / exp) % 10
        count[digit]++

    // prefix sum
    for d = 1 to 9:
        count[d] += count[d-1]

    // build output (RIGHT → LEFT for stability)
    for i = n-1 down to 0:
        digit = (A[i] / exp) % 10
        output[count[digit] - 1] = A[i]
        count[digit]--

    copy output back to A
`}
                            </pre>
                        </div>
                    </motion.div>

                    {/* C++ Code Section */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm"
                    >
                        <div className="bg-muted px-4 py-3 border-b border-border">
                            <h2 className="font-semibold text-sm">C++ Implementation</h2>
                        </div>
                        <div className="p-4 overflow-x-auto bg-[#1e1e1e] text-[#d4d4d4]">
                            <pre className="text-xs md:text-sm leading-relaxed font-mono">
                                {`#include <bits/stdc++.h>
using namespace std;

void countingSortByDigit(vector<long long>& a, long long exp) {
    int n = a.size();
    vector<long long> output(n);
    int count[10] = {0};

    // Count digit occurrences
    for (int i = 0; i < n; i++) {
        int digit = (a[i] / exp) % 10;
        count[digit]++;
    }

    // Prefix sum
    for (int d = 1; d < 10; d++) {
        count[d] += count[d - 1];
    }

    // Build output (right to left → stable)
    for (int i = n - 1; i >= 0; i--) {
        int digit = (a[i] / exp) % 10;
        output[count[digit] - 1] = a[i];
        count[digit]--;
    }

    // Copy back
    a = output;
}

void radixSort(vector<long long>& a) {
    long long maxVal = *max_element(a.begin(), a.end());

    for (long long exp = 1; maxVal / exp > 0; exp *= 10) {
        countingSortByDigit(a, exp);
    }
}

int main() {
    vector<long long> a = {170, 45, 75, 90, 802, 24, 2, 66};
    radixSort(a);

    for (long long x : a) cout << x << " ";
    cout << endl;
}
`}
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CodeView;
