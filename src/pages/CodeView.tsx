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
                            <h2 className="font-semibold text-sm">Pseudocode (LSD String Sort)</h2>
                        </div>
                        <div className="p-4 overflow-x-auto">
                            <pre className="text-sm text-black leading-relaxed">
                                {`function RadixSort(arr, maxLen):
    // Process from last character to first (LSD)
    for position from maxLen-1 down to 0:
        
        // 1. Create buckets for each possible character
        buckets = empty list of lists
        
        // 2. Distribute elements into buckets
        for string in arr:
            char = string[position]
            add string to buckets[char]
            
        // 3. Collect elements back into array
        arr = []
        for bucket in buckets (in order):
            arr.append(all elements in bucket)
            
    return arr

// Notes:
// - For numbers, use (number / 10^pos) % 10
// - For descending order:
//   Option A: Collect from buckets in reverse order
//   Option B: Traverse buckets in reverse
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
                                {`#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

// Get character at position or logical padding
int getChar(const string& s, int pos, int maxLen) {
    // Logic handles varying string lengths
    // effective index = s.length() - 1 - p
    // but here we align right (LSD)
    int index = s.length() - 1 - pos;
    if (index < 0) return 0; // standard padding definition
    return (unsigned char)s[index];
}

void countSort(vector<string>& arr, int pos, int maxLen, bool asc) {
    vector<string> output(arr.size());
    int count[256] = {0};
    
    // Store count of occurrences
    for (const string& s : arr) {
        count[getChar(s, pos, maxLen)]++;
    }
    
    // Change count[i] so that count[i] now contains actual
    // position of this character in output array
    // DESCENDING: We can reverse accumulation or index mapping
    if (asc) {
        for (int i = 1; i < 256; i++)
            count[i] += count[i - 1];
    } else {
        // For descending, accumulate from end or reverse
        // Simple way: accum normal, then fill output reversed? 
        // No, stable sort requirement means we adhere to bucket order
        // Let's standard accumulate but we iterate buckets backwards later?
        // Actually, easier to just adjust counts for reverse placement?
        // Let's stick to standard LSD, collecting reverse order 
        // is equivalent to traversing counts backwards?
        // simpler for viz explanation: iterate buckets backwards.
        // But for Counting Sort array impl:
        for (int i = 254; i >= 0; i--)
             count[i] += count[i + 1];
    }
    
    // Build the output array
    for (int i = arr.size() - 1; i >= 0; i--) {
        int charIdx = getChar(arr[i], pos, maxLen);
        output[count[charIdx] - 1] = arr[i];
        count[charIdx]--;
    }
    
    arr = output;
}

void radixSort(vector<string>& arr, bool asc = true) {
    if (arr.empty()) return;
    
    // Find max length
    size_t maxLen = 0;
    for (const auto& s : arr) maxLen = max(maxLen, s.length());
    
    // Do counting sort for every digit position
    for (int pos = 0; pos < maxLen; pos++) {
        countSort(arr, pos, maxLen, asc);
    }
}

int main() {
    vector<string> arr = {"apple", "banana", "grape", "app"};
    radixSort(arr, true); // Ascending
    
    for (const auto& s : arr) cout << s << " ";
    return 0;
}`}
                            </pre>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default CodeView;
