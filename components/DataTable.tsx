import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Edit, Trash2, Eye } from 'lucide-react-native';

export interface Column {
    header: string;
    accessor: string;
    width?: number;
}

export interface DataTableProps {
    columns: Column[];
    data: any[];
    onEdit?: (row: any) => void;
    onDelete?: (row: any) => void;
    onView?: (row: any) => void;
}

export default function DataTable({ columns, data, onEdit, onDelete, onView }: DataTableProps) {
    return (
        <View className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <ScrollView horizontal showsHorizontalScrollIndicator={true}>
                <View>
                    {/* Header */}
                    <View className="flex-row bg-gray-50 border-b border-gray-200">
                        {columns.map((col, index) => (
                            <View key={index} className="p-4" style={{ width: col.width || 150 }}>
                                <Text className="font-semibold text-gray-600 text-sm">{col.header}</Text>
                            </View>
                        ))}
                        <View className="p-4 w-32">
                            <Text className="font-semibold text-gray-600 text-sm">Actions</Text>
                        </View>
                    </View>

                    {/* Rows */}
                    {data.map((row, rowIndex) => (
                        <View key={rowIndex} className="flex-row border-b border-gray-100 hover:bg-gray-50">
                            {columns.map((col, colIndex) => (
                                <View key={colIndex} className="p-4 justify-center" style={{ width: col.width || 150 }}>
                                    <Text className="text-gray-700 text-sm">{row[col.accessor]}</Text>
                                </View>
                            ))}
                            <View className="p-4 w-32 flex-row space-x-2">
                                {onView && (
                                    <TouchableOpacity onPress={() => onView(row)} className="p-2 bg-blue-50 rounded-lg">
                                        <Eye size={16} color="#3B82F6" />
                                    </TouchableOpacity>
                                )}
                                {onEdit && (
                                    <TouchableOpacity onPress={() => onEdit(row)} className="p-2 bg-indigo-50 rounded-lg">
                                        <Edit size={16} color="#4F46E5" />
                                    </TouchableOpacity>
                                )}
                                {onDelete && (
                                    <TouchableOpacity onPress={() => onDelete(row)} className="p-2 bg-red-50 rounded-lg">
                                        <Trash2 size={16} color="#EF4444" />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
